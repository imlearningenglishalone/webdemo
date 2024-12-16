(function() {


    // Wrap the original addEventListener method
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const tagName = this.nodeName;
        const typeEvent = [
            'timeupdate',
            'durationchange',
            'loadstart',
            'loadedmetadata',
            'play',
            'playing',
            'progress',
            'pause',
            'ended',
            'waiting',
            'seeking',
            'seeked'
        ];
    
        // // Wrap the original listener with a custom function
        // const wrappedListener = function(event) {
        //     //console.log(`Custom logic before ${type} event on <${tagName.toLowerCase()}>`);
        //     // Inject your custom logic here
    
        //     // Call the original listener
        //     listener.call(this, event);
    
        //     console.log(`Custom logic after ${type} event on <${tagName.toLowerCase()}>`);
        //     // Additional custom logic, if needed
        // };
    

        if (window.self === window.top && tagName === "VIDEO" && typeEvent.includes(type)) {
            console.log(`Event Listener added for ${type} on <${tagName.toLowerCase()}>`);
    
    
            if (type === "timeupdate" && !this._customTimeUpdateAdded) {
                
                
                this._customTimeUpdateAdded = true; // Flag to prevent adding multiple listeners
                this.addEventListener("timeupdate", function() {

                    document.ivideo = this; //update this video address it change all the time
                    console.log(this.currentTime)
                    checkivideoads(this);

                });
                document.removeEventListener("keydown", handleKeyPresss);
                document.addEventListener("keydown", handleKeyPresss);

            }
      
        }
    
        // Call the original addEventListener method with the wrapped listener
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    
    function checkivideoads(video){

        //const element = document.querySelector("#movie_player > div.video-ads.ytp-ad-module")
        let element = document.querySelector("div.video-ads.ytp-ad-module")
        if(!element) return;
        if(element.childElementCount > 0){

        //if (element && element.hasChildNodes()) { 
            console.log("The element has children. ADS ON"); 
    
            if (video && video.duration){
                video.muted = true;
                video.currentTime = video.duration -5;
                //video.playbackRate = 16;
                //video.pause
            }
            setTimeout(() => {
                const skipButtons = document.querySelectorAll(".ytp-ad-skip-button");
                for (const skipButton of skipButtons) skipButton.click();
            }, 300);
            setTimeout(() => {
                    //when video DISBALE PLAYING - BLOCK ADS
                    document.querySelector("#error-screen")?.hidden ? void(0) : location.reload()
            }, 1000);
    
        }
    }
    function handleKeyPresss(event) {
    
        const playbackRateConfig = [
            { key: 'S', modifier: 'shiftKey', action: 'increase', amount: 0.025 },
            { key: 'X', modifier: 'shiftKey', action: 'decrease', amount: 0.025 },
            { key: 'Z', modifier: 'shiftKey', action: 'reset', amount: 1.0 }
        ];
    
        const timeAdjustConfig = [
            { key: 'x', action: 'forward', amount: 10 },
            { key: 'z', action: 'rewind', amount: 1.5 }
        ];
    
    
    
        const video = document.ivideo || document.querySelector('video');
        if (!video) return;
    
        timeAdjustConfig.forEach(config => {
            if (event.key.toLowerCase() === config.key) {
                video.currentTime += config.action === 'forward' ? config.amount : -config.amount;
                console.log(`Video ${config.action}ed to ${video.currentTime}s`);
            }
        });
    
        playbackRateConfig.forEach(config => {
            if (event.key.toUpperCase() === config.key && event[config.modifier]) {
                if (config.action === 'increase') {
                    video.playbackRate += config.amount;
                    console.log(`Video speed increased to ${video.playbackRate}`);
                } else if (config.action === 'decrease') {
                    video.playbackRate -= config.amount;
                    console.log(`Video speed decreased to ${video.playbackRate}`);
                } else if (config.action === 'reset') {
                    video.playbackRate = config.amount;
                    console.log(`Video speed reset to normal (1.0)`);
                }
            }
        });
    }
    
    return;
    })();
        