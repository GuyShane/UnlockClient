async function hasCamera(){
    const media=window.navigator.mediaDevices;
    if (!media || !media.enumerateDevices){return false;}
    const devices=await media.enumerateDevices();
    return devices.some(d=>d.kind==='videoinput');
}

async function start(video){
    const stream=await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: {
                max: 1280
            }
        },
        audio: false});
    video.srcObject=stream;
    video.play();
    return stream;
}

function capture(video, canvas){
    const ctx=canvas.getContext('2d');
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

function stop(stream){
    stream.getTracks()[0].stop();
}

export {
    hasCamera,
    start,
    capture,
    stop
};
