document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.carousel__slides');
    const sliderWith = document.querySelectorAll('.carousel__slide');
    const leftIndicator = document.querySelector('.carousel__indicator--left');
    const rightIndicator = document.querySelector('.carousel__indicator--right');
  
    let currentIndex = 0;
    const slideWidth = slidesContainer.clientWidth;
    const numSlides = slidesContainer.children.length;
  
    function goToSlide(index) {
        sliderWith.forEach( (item, id) => {
            if(id == index){
                slidesContainer.style.transform = `translateX(-${Math.abs((item.clientWidth*(index+1)) - slideWidth) }px)`;
            }
        })
    }

    leftIndicator.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + numSlides) % numSlides;
      goToSlide(currentIndex);
    });
  
    rightIndicator.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % numSlides;
      goToSlide(currentIndex);
    });


    /* PopUp */
    var PopupCloseBTN = document.getElementById("closePopUp-Btn")
    var Popup = document.getElementById("popup")
    var activatePopup = document.querySelectorAll(".animationPopUp");
    PopupCloseBTN.addEventListener('click', () => {
      Popup.classList.add("PopUp--close")
      var displayIframe = document.getElementById("displayInfo");
      iframeContentDelete = document.getElementById("contentPopup")
      displayIframe.removeChild(iframeContentDelete)
      
    })

    activatePopup.forEach((item, id) => {
      item.addEventListener('click', () => {
        Popup.classList.remove("PopUp--close");
          /* Display iframe */
          var displayIframe = document.getElementById("displayInfo");
          const rutesIframe = ['./Post/animation1.html', './Post/animation2.html', './Post/animation3.html', './Post/animation4.html', './Post/animation5.html', './Post/animation6.html']
          var contentPopup = document.createElement('iframe')
          contentPopup.src = rutesIframe[id]
          contentPopup.frameBorder = "0"
          contentPopup.width = "100%"
          contentPopup.height = "350vh"
          contentPopup.style = "width: 100%;"
          contentPopup.id= "contentPopup"
          displayIframe.appendChild(contentPopup);
      })
    })

    
   /* Funciones dentro del IFRAME del popup */

  

  });
  