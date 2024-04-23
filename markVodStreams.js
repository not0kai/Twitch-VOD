function markStreamFromVods(ref_ob,vods){
    let timestamps = [
        ...Array(200).fill().map((_,i)=>Math.floor(ref_ob.timestamp/1000) + i), 
        ...Array(200).fill().map((_,i)=>Math.floor(ref_ob.timestamp/1000) - i)
    ];
    // console.log(['timestamps',timestamps])
    let matches = vods?.filter(v=> timestamps.some(t=> t == Math.floor(v.timestamp/1000)));
    let timestamp_difs = vods?.map(v=> Math.abs(ref_ob.timestamp-v.timestamp));
    let ix = matches?.length ? timestamp_difs.findIndex(dif=> dif == Math.min(...timestamp_difs)) : 0;
    let vod_record = matches?.length < 2 && matches?.length > 0 ? matches[0] : matches?.length > 0 ? matches[ix] : {};
    return {
        ...ref_ob,
        ...vod_record,
        ...{is_nuked:!matches?.length}
    }
}


function markNukedStreams(streams, vods) {
    // console.log({streams:streams, vods:vods})
    var expandTimestamps = (n,r)=> [...Array(n).fill().map((_,i)=> Math.floor(r.timestamp/1000) + i), ...Array(n).fill().map((_,i)=> Math.floor(r.timestamp/1000) - i)];
    return streams.map(r=>{
        let originals = [];
        let timestamps_arr = [expandTimestamps(200,r),expandTimestamps(300,r),expandTimestamps(400,r),expandTimestamps(500,r),expandTimestamps(600,r),expandTimestamps(700,r),expandTimestamps(800,r),expandTimestamps(900,r),expandTimestamps(1100,r),expandTimestamps(1300,r),expandTimestamps(1500,r),expandTimestamps(1650,r),expandTimestamps(1900,r),,expandTimestamps(2100,r)];
        let tsr = timestamps_arr.map(timestamps=> {
            if(!originals.length){
                let og = vods.filter(v=>timestamps.some(t=> t  == Math.floor(v.timestamp/1000)))?.[0]
                if(og) {originals.push(og); return og}
            }else{return false}
        });
        let original = originals?.[0]
        // console.log(['original',original,tsr])
        return {
            ...r,
            ...cleanObject({
                vod_id:original?.vod_id,
                timestamp: original?.timestamp,
                original_title: original?.title,
                animated_preview_url: original?.animated_preview_url,
                is_nuked: !original
            })
        }
    });
}