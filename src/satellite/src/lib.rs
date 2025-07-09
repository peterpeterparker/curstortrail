use junobuild_macros::{
    assert_delete_asset, assert_delete_doc, assert_set_doc, assert_upload_asset, on_delete_asset,
    on_delete_doc, on_delete_filtered_assets, on_delete_filtered_docs, on_delete_many_assets,
    on_delete_many_docs, on_set_doc, on_set_many_docs, on_upload_asset,
};
use junobuild_satellite::{
    include_satellite, AssertDeleteAssetContext, AssertDeleteDocContext, AssertSetDocContext,
    AssertUploadAssetContext, OnDeleteAssetContext, OnDeleteDocContext,
    OnDeleteFilteredAssetsContext, OnDeleteFilteredDocsContext, OnDeleteManyAssetsContext,
    OnDeleteManyDocsContext, OnSetDocContext, OnSetManyDocsContext, OnUploadAssetContext,
};
use junobuild_utils::{decode_doc_data, encode_doc_data};
use junobuild_satellite::{set_doc_store, SetDoc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct TrailStats {
    pub total_trails: u32,
    pub total_distance: f64,
    pub total_elevation: f64,
    pub average_distance: f64,
    pub average_elevation: f64,
    pub difficulty_breakdown: DifficultyBreakdown,
    pub last_updated: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct DifficultyBreakdown {
    pub easy: u32,
    pub moderate: u32,
    pub hard: u32,
    pub expert: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Trail {
    pub distance: f64,
    pub elevation: f64,
    pub difficulty: String,
}

// All the available hooks and assertions for your Datastore and Storage are scaffolded by default in this `lib.rs` module.
// However, if you don’t have to implement all of them, for example to improve readability or reduce unnecessary logic,
// you can selectively enable only the features you need.
//
// To do this, disable the default features in your `Cargo.toml` and explicitly specify only the ones you want to use.
//
// For example, if you only need `on_set_doc`, configure your `Cargo.toml` like this:
//
// [dependencies]
// junobuild-satellite = { version = "0.0.22", default-features = false, features = ["on_set_doc"] }
//
// With this setup, only `on_set_doc` must be implemented with custom logic,
// and other hooks and assertions can be removed. They will not be included in your Satellite.

#[on_set_doc]
async fn on_set_doc(context: OnSetDocContext) -> Result<(), String> {
    // Only process the "trails" collection
    if context.data.collection != "trails" {
        return Ok(());
    }

    // Decode the new trail
    let current_trail: Trail = decode_doc_data(&context.data.data.after.data)?;

    // Try to get existing stats
    let stats_doc = junobuild_satellite::get_doc_store(
        context.caller,
        "stats".to_string(),
        "trail-stats".to_string(),
    )?;

    let mut stats = if let Some(doc) = stats_doc {
        decode_doc_data::<TrailStats>(&doc.data)?
    } else {
        TrailStats::default()
    };

    // Update stats
    stats.total_trails += 1;
    stats.total_distance += current_trail.distance;
    stats.total_elevation += current_trail.elevation;
    stats.average_distance = stats.total_distance / stats.total_trails as f64;
    stats.average_elevation = stats.total_elevation / stats.total_trails as f64;

    match current_trail.difficulty.as_str() {
        "easy" => stats.difficulty_breakdown.easy += 1,
        "moderate" => stats.difficulty_breakdown.moderate += 1,
        "hard" => stats.difficulty_breakdown.hard += 1,
        "expert" => stats.difficulty_breakdown.expert += 1,
        _ => {}
    }

    stats.last_updated = ic_cdk::api::time().to_string();

    // Encode and save
    let encoded_stats = encode_doc_data(&stats)?;

    let set_doc = SetDoc {
        data: encoded_stats,
        description: Some("Trail statistics".to_string()),
        version: Some(1),
    };

    set_doc_store(
        context.caller,
        "stats".to_string(),
        "trail-stats".to_string(),
        set_doc,
    )?;

    Ok(())
}

include_satellite!();
