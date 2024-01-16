<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * {box-sizing: border-box}
  body {font-family: Verdana, sans-serif; margin: 0; padding: 0}
  .c-container {
    max-width: 100%;
    position: relative;
    overflow: hidden;
    max-height: 100vh; /* Set a fixed height for the container */
    object-fit: contain;
  }
  
  .c {
    display: flex;
    transition: transform 0.75s ease-in-out;
  }
  
  .c-item {
    flex: 0 0 100%;
    position: relative;
  }
  
  .c-item img {
    width: 100%;
    height: 100vh;
  }

  .c-caption {
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    font-size: 20px;
    color: white;
    padding: 10px;
    text-align: center;
  }
  
  /* Next & previous buttons */
  .prev, .next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    width: auto;
    padding: 16px;
    margin-top: -22px;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 0;
    user-select: none;
  }
  
  /* Position the "next button" to the right */
  .next {
    right: 0;
    border-radius: 0;
  }
  
  /* Position the "previous button" to the left */
  .prev {
    left: 0;
    border-radius: 0;
  }

  /* Custom button images */
  .prev img, .next img {
    width: 40px; /* Adjust the width and height as needed */
    height: 40px;
  }
</style>
 
  <div class="c-container">
    <div class="c">
      <div class="c-item">
        <img src="Icons/p4.jpg" alt="Picture 1">
        <div class="c-caption">Caption for picture 1</div>
      </div>
      <div class="c-item">
        <img src="Icons/p2.jpg" alt="Picture 2">
        <div class="c-caption">Caption for picture 2</div>
      </div>
      <div class="c-item">
        <img src="Icons/p4.jpg" alt="Picture 3">
        <div class="c-caption">Caption for picture 3</div>
      </div>
    </div>
    <a class="prev" onclick="prevSlide()"><img src="Icons/arrow_left.png"></a>
    <a class="next" onclick="nextSlide()"><img src="Icons/arrow_right.png"></a>
  </div>
  
  <script>
  let currentSlide = 0;
  const carousel = document.querySelector(".c");
  const carouselItems = document.querySelectorAll(".c-item");
  const totalSlides = carouselItems.length;
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  function updateCarousel() {
    const translateX = currentSlide * -100;
    carousel.style.transform = `translateX(${translateX}%)`;
  }
  
  </script>

</html>