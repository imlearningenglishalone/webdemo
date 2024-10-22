//In DEV tools / application / Service workers/  check offline  => it will refesh new this file when you change. if you don't do that - it's not gonna change anything


const CACHE_NAME = "CNC-snipetv1"; // Name of the cache
const OFFLINE_URL = "/offline.html"; // Fallback page when offline

// Files to cache for offline access
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/style.css',
    'https://script.google.com/macros/s/AKfycbyKZHUQlDqoAEHMw8IqU81Ys-mjE4ihGSJXlfYZheSl-6ZqIgRoN6giXQvxWNHbhr3M/exec?name=script', 
     //'/offline.html', // Offline fallback page
];

// Install event: Cache the specified files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            //console.log("Opened cache");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate event: Clean up old caches if necessary
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve cached assets if offline, fallback to offline page if necessary
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Serve the cached response if found
            if (response) {
                // If a matching cache is found, return the cached response
                return response;
            }
            
            // // Try to fetch the request from the network
            return fetch(event.request).catch(() => {
            //     // If both the cache and network fail, show the offline page
            //     //return caches.match(OFFLINE_URL);  
            //     //if not cache - anf not connect internet - show this page

            });
        })
    );
});





















self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'MESSAGE_FROM_PAGE') {
        console.log('Received message from page:', event.data.text);
        // Optionally, you can send a response back to the page here
    }
    if (event.data && event.data.type === 'CACHE_RESOURCES') {  
        // Optionally, you can send a response back to the page here
        cache_again(event)
    }
    if (event.data && event.data.type === 'CACHE_REMOVE') {  
        console.log("server worker - remove cache")
        cache_remove(event)
    }
    
});


function cache_again(event){
    caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }).then(() => {
        //console.log('Resources cached successfully.');
        post_Message('Resources cached successfully. !',event)
    }).catch((error) => {
        console.error('Error while caching resources:', error);
    });
}
function cache_remove(event){
    // Open the cache and delete it
    caches.delete(CACHE_NAME).then((success) => {
        if (success) {
            //console.log('Cache cleared successfully.');

            post_Message("CACHE_REMOVE", event)
        } else {
            console.log('Cache was not found.');
        }
        // Reload the page after cache is removed
        //location.reload(); // Reloads the current page
    }).catch((error) => {
        console.error('Error while clearing cache:', error);
    });
}
function post_Message(msg, event){
    let message = {
        type: msg,
        text: 'message from sevice worker'
    }
    event.source.postMessage(message);
}