function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  function longPressAction(e) {

        // function log(e){
        //     let rowId = e.target.closest('[data-key]');
        //     rowId = Number(rowId.dataset.key)
        //     console.log(rowId); // This will log the event object
        // }

        // Execute all registered functions
        dofun.longPress.forEach(func => func(e));
  }
  
  export function ini_longPress() {
    const myElement = document.querySelector("table tbody");
    const debouncedLongPressAction = debounce(longPressAction, 600);
    let timer;
    dofun.longPress = []

    myElement.addEventListener('pointerdown', function(event) {
      timer = setTimeout(() => debouncedLongPressAction(event), 600);
    });
  
    myElement.addEventListener('pointerup', function() {
      clearTimeout(timer);
    });
  
    myElement.addEventListener('pointerleave', function() {
      clearTimeout(timer);
    });
  
    myElement.addEventListener('pointercancel', function() {
      clearTimeout(timer);
    });
  }
  




  //To ensure that the long press is not accidentally triggered multiple times, debounce function