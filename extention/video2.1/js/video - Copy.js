(function() {
    // Configuration array for playback rates
    const playbackRateConfig = [
        { key: 'S', modifier: 'shiftKey', action: 'increase', amount: 0.025 },
        { key: 'X', modifier: 'shiftKey', action: 'decrease', amount: 0.025 },
        { key: 'Z', modifier: 'shiftKey', action: 'reset', amount: 1.0 }
    ];

    // Configuration array for time adjustments
    const timeAdjustConfig = [
        { key: 'x', action: 'forward', amount: 10 },
        { key: 'z', action: 'rewind', amount: 1.5 }
    ];

    // Utility function to add video event hooks
    function addVideoEventHook(eventType, customHandler) {
        document.CrazyVideoFn = document.CrazyVideoFn || [];
        document.CrazyVideoFn.push({ eventType, customHandler });

        if (!EventTarget.prototype.originalAddEventListener) {
            EventTarget.prototype.originalAddEventListener = EventTarget.prototype.addEventListener;

            EventTarget.prototype.addEventListener = function(type, listener, options) {
                const isVideo = this.nodeName === 'VIDEO';
                const shouldHook = isVideo && ['play', 'pause', 'durationchange', 'timeupdate'].includes(type);

                if (shouldHook && options !== 'CrazyMe') {
                    document.CrazyVideoFn.forEach(({ eventType, customHandler }) => {
                        if (eventType === type) {
                            const originalListener = listener;
                            listener = function(event) {
                                customHandler(event);
                                originalListener.call(this, event);
                            };
                        }
                    });
                }

                this.originalAddEventListener(type, listener, options);
            };
        }
    }

    // Function to initialize custom video event handlers
    function initializeVideoHooks() {
        addVideoEventHook('play', event => {
            const video = event.target;
            console.log(`Video started playing: ${video.currentSrc}`);
        });

        addVideoEventHook('pause', event => {
            const video = event.target;
            console.log(`Video paused: ${video.currentSrc}`);
        });

        addVideoEventHook('durationchange', event => {
            const video = event.target;
            console.log(`Video duration changed: ${video.duration}`);
        });

        addVideoEventHook('timeupdate', event => {
            const video = event.target;
            console.log(`Video time updated: ${video.currentTime}`);
            isYoutube(video)
        });
    }

    // Function to handle key press events
    function handleKeyPress(event) {
        const video = document.ivideo || document.querySelector('video');
        if (!video) return;

        // Check for time adjustment keys
        timeAdjustConfig.forEach(config => {
            if (event.key.toLowerCase() === config.key) {
                video.currentTime += config.action === 'forward' ? config.amount : -config.amount;
                console.log(`Video ${config.action}ed to ${video.currentTime}s`);
            }
        });

        // Check for playback rate adjustment keys
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

    // Initialize hooks and key press handling once the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeVideoHooks();
            document.addEventListener('keydown', handleKeyPress);
        });
    } else {
        initializeVideoHooks();
        document.addEventListener('keydown', handleKeyPress);
    }


    //Skip ads 
    function isYoutube(video){
        if(window.location.hostname !== 'www.youtube.com') return
        
        let a = () => document.querySelector(".ytp-skip-ad-button")
        let b = () => document.querySelector("div.video-ads.ytp-ad-module")
        if(a()) a().click()
        if(b() && b().children.length > 0 ) {

            if (video && video.duration){
                video.muted = true
                video.playbackRate = 16;
            }
            console.log(video.playbackRate, "video.playbackRate")
        }



        setTimeout(() => {
            const skipButtons = document.querySelectorAll(".ytp-ad-skip-button");
            for (const skipButton of skipButtons) {
              skipButton.click();
            }
        }, 10)


    }
})();
