// detect overscroll attempt on mobile
el.addEventListener('touchmove', (e) => {
  const atTop = el.scrollTop === 0;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

  if ((atTop && e.touches[0].clientY > 0) || 
      (atBottom && e.touches[0].clientY < 0)) {
    console.log('User is trying to overscroll');
  }
});


// detect overscroll attempt on desktop
el.addEventListener('wheel', (e) => {
  const before = el.scrollTop;
  el.scrollTop += e.deltaY;
  if (el.scrollTop === before) {
    console.log('Tried to scroll past bounds');
  }
});


// what i need instead of scroll position is the distance between position of the top border of the last element
// and the top border of its container
//
// this way i could calculate the scroll position of that element with the new data ? (since the data above it will be less in count)
