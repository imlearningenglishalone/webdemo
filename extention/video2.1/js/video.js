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
            
            document.ivideo = this;
            this._customTimeUpdateAdded = true; // Flag to prevent adding multiple listeners
            this.addEventListener("timeupdate", function() {
                checkivideoads(this);
            });
        }


    }

    // Call the original addEventListener method with the wrapped listener
    return originalAddEventListener.call(this, type, listener, options);
};


function checkivideoads(video){
    const element = document.querySelector("#movie_player > div.video-ads.ytp-ad-module")
    if (element && element.hasChildNodes()) { 
        console.log("The element has children. ADS ON"); 

        if (video && video.duration){
            video.muted = true;
            video.currentTime = video.duration -5;
            video.playbackRate = 16;
            //video.pause
        }
        setTimeout(() => {
            const skipButtons = document.querySelectorAll(".ytp-ad-skip-button");
            for (const skipButton of skipButtons) skipButton.click();
        }, 300);
        setTimeout(() => {
                //when video DISBALE PLAYING - BLOCK ADS
                document.querySelector("#error-screen")?.hidden ? void(0) : location.reload()
        }, 1000);s

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

document.addEventListener("keydown",handleKeyPresss)


return;









    const playbackRateConfig = [
        { key: 'S', modifier: 'shiftKey', action: 'increase', amount: 0.025 },
        { key: 'X', modifier: 'shiftKey', action: 'decrease', amount: 0.025 },
        { key: 'Z', modifier: 'shiftKey', action: 'reset', amount: 1.0 }
    ];

    const timeAdjustConfig = [
        { key: 'x', action: 'forward', amount: 10 },
        { key: 'z', action: 'rewind', amount: 1.5 }
    ];

    // Store references to event listeners
    const eventListeners = {};

    // Utility function to add video event hooks
    function addVideoEventHook(video, eventType, customHandler) {
        // Remove existing event listener if it exists
        if (eventListeners[video] && eventListeners[video][eventType]) {
            video.removeEventListener(eventType, eventListeners[video][eventType]);
            console.log(`Removed existing event listener for ${eventType}`);
        }

        // Add the new event listener
        const listener = function(event) {
            customHandler(event);
        };

        video.addEventListener(eventType, listener);

        // Store the reference to the added listener
        eventListeners[video] = eventListeners[video] || {};
        eventListeners[video][eventType] = listener;
    }

    // Function to initialize custom video event handlers
    function initializeVideoHooks(video) {
        addVideoEventHook(video, 'play', event => {
            console.log(`Video started playing: ${video.currentSrc}`);
            input_search();
        });

        addVideoEventHook(video, 'pause', event => {
            console.log(`Video paused: ${video.currentSrc}`);
            input_search();
        });

        addVideoEventHook(video, 'durationchange', event => {
            console.log(`Video duration changed: ${video.duration}`);
            input_search();
        });

        addVideoEventHook(video, 'timeupdate', event => {
            console.log(`Video time updated: ${video.currentTime}`);
            isYoutube(video);
            input_search();
        });
    }

    // Function to handle key press events
    function handleKeyPress(event) {
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





    

    // // Initialize hooks and key press handling once the DOM is fully loaded
    // function initialize() {
    //     const video = document.ivideo || document.querySelector('video');
    //     if (video) {
    //         initializeVideoHooks(video);
    //         document.addEventListener('keydown', handleKeyPress);
    //         console.log("Initialization complete, document state:", document.readyState);
    //     } else {
    //         console.log('Video element not found.');
    //         //setTimeout(()=>initialize(),1000)
    //     }
    // }

    // // Check if DOM is already loaded, otherwise wait for it to load
    // if (document.readyState === "complete") {
    //     initialize();
    // } else {
    //     document.addEventListener("readystatechange", function() {
    //         if (document.readyState === "complete") {
    //             setTimeout(()=>initialize(),1000)
    //         }
    //     });
    // }






    // Skip ads on YouTube
    function isYoutube(video) {
        if (window.location.hostname !== 'www.youtube.com') return;

        let a = () => document.querySelector(".ytp-skip-ad-button");
        let b = () => document.querySelector("div.video-ads.ytp-ad-module");
        if (a()) a().click();
        if (b() && b().children.length > 0 ) {
            if (video && video.duration){
                video.muted = true;
                video.currentTime = video.duration -5;
                video.playbackRate = 16;
            }
            console.log(video.playbackRate, "video.playbackRate");
        }

        setTimeout(() => {
            const skipButtons = document.querySelectorAll(".ytp-ad-skip-button");
            for (const skipButton of skipButtons) {
              skipButton.click();
            }
        }, 10);
    }

    // Function to update input placeholder
    function input_search() {
        const searchInput = document.querySelector("input#search");
        if (searchInput) {
            searchInput.placeholder = "Set";
        } else {
            console.log("Search input not found");
        }
    }










    // document.addEventListener('DOMContentLoaded', function() {
    //     console.log('DOM fully loaded and parsed');
    //     // Add your code here
    // });
    //         // Function to update the status based on document.readyState
    //         function checkReadyState() {
    //             let statusDiv = "nothing"
    //             switch (document.readyState) {
    //                 case 'loading':
    //                     statusDiv = 'Document is still loading...';
    //                     break;
    //                 case 'interactive':
    //                     statusDiv = 'Document is interactive (DOM is fully parsed).';
    //                     break;
    //                 case 'complete':
    //                     statusDiv = 'Document is complete (all resources loaded).';
    //                     break;
    //             }

    //             if (window.self == window.top) console.log(statusDiv + location.href )  // because it had iframe
    //         }
    
    //         // Initial check
    //         checkReadyState();
    
    //         // Add an event listener for changes in document.readyState
    //         document.addEventListener('readystatechange', checkReadyState);















})();





