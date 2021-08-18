//* Find height post text
const contentTitleAll = document.querySelectorAll('.content__title')
let biggestHeight = 0
contentTitleAll.forEach(el => {
  const bottom = el.offsetTop + el.getBoundingClientRect().height
  if (bottom > biggestHeight) biggestHeight = bottom
})
const contentTextAll = document.querySelectorAll('.content__text')
contentTextAll.forEach(el => {
  el.style.position = "absolute"
  el.style.top =  biggestHeight + 10 + "px"
  el.style.left = "0"
  el.style.zIndex = "2"
})


//* Find margin size between '.content__container'
const contentSection = document.querySelector('.content__section')
let contentSectionWidth = contentSection.offsetWidth // size content__section

const contentWrappers = document.querySelectorAll('.content__container')

let contentWrapperWidth = contentWrappers[0].getBoundingClientRect().width // size content__container

let countVisibleContentWrapper = 1
while ((contentSectionWidth / ((contentWrapperWidth + 40) * (countVisibleContentWrapper + 1) - 40)) >= 1) {
  countVisibleContentWrapper++
}

let marginContentWrapper = (contentSectionWidth - contentWrapperWidth * countVisibleContentWrapper) / (countVisibleContentWrapper - 1) - 0.1

const contentWrapperAll = document.querySelectorAll('.content__container')

const resizeMargin = () => {
  contentSectionWidth = contentSection.offsetWidth 
  contentWrapperWidth = contentWrappers[0].getBoundingClientRect().width
  countVisibleContentWrapper = 1
  while ((contentSectionWidth / ((contentWrapperWidth + 40) * (countVisibleContentWrapper + 1) - 40)) >= 1) {
    countVisibleContentWrapper++
  }
  marginContentWrapper = (contentSectionWidth - contentWrapperWidth * countVisibleContentWrapper) / (countVisibleContentWrapper - 1) - 0.1
  if (countVisibleContentWrapper === 1) marginContentWrapper = 40
  contentWrapperAll.forEach((el, index) => index ? el.style.marginLeft = marginContentWrapper + "px" : false)
}
resizeMargin()
window.addEventListener(`resize`, resizeMargin, false);



//* Add Scroll on button
const contentLine = document.querySelector('.content__line')
const contentLineWidth = contentLine.getBoundingClientRect().width
const maxScrollLength = contentLineWidth - contentSectionWidth

const scrollSize = contentWrapperWidth + marginContentWrapper
let currentContentScroll = 0
let currentLineScroll = 0

const leftButton = document.querySelector(".scroll__button--left")
const rightButton = document.querySelector(".scroll__button--right")

const scrollTrack = document.querySelector(".scroll__track")
const scrollTrackWidth = scrollTrack.offsetWidth
const scrollLine = document.querySelector(".scroll__line")
const scrollLineWidth = scrollLine.offsetWidth

const scrollContentLine = (direction = "right") => {
  if (direction === "right") {
    currentContentScroll = Math.max(currentContentScroll - scrollSize, -maxScrollLength)
    currentLineScroll = Math.min((currentLineScroll + (scrollTrackWidth / (contentWrappers.length - countVisibleContentWrapper))), (scrollTrackWidth - scrollLineWidth))
  } 
  if (direction === "left") {
    currentContentScroll = Math.min(currentContentScroll + scrollSize, 0)
    currentLineScroll = Math.max((currentLineScroll - (scrollTrackWidth / (contentWrappers.length - countVisibleContentWrapper))), 0)
  }
  if (typeof direction === "number") {
    currentContentScroll = Math.max(Math.min(direction + currentContentScroll, 0), -maxScrollLength)
    let displayMult = 2
    if (countVisibleContentWrapper === 1) displayMult = 3
    currentLineScroll = Math.min(Math.max(currentLineScroll - (direction * scrollTrackWidth * displayMult / contentSectionWidth / (contentWrappers.length - countVisibleContentWrapper)), 0), (scrollTrackWidth - scrollLineWidth))
  }
  
  contentLine.style.left = currentContentScroll + "px"
  scrollLine.style.left = currentLineScroll + "px"
}

const onScrollButtonClick = (event) => {
  if (!event.target.closest(".scroll__button")) return
  event.target.closest(".scroll__button--left") ? scrollContentLine("left") : scrollContentLine("right")
}

document.addEventListener("click", onScrollButtonClick)


//* Add autoscroll
autoscroll = setInterval(scrollContentLine, 4000)


//* Add pointerscroll
contentLine.onpointerdown = (event) => {
  clearInterval(autoscroll)
  let position = event.pageX

  const onPointerMove = (event) => {
    scrollContentLine(event.pageX - position)
    position = event.pageX
  }

  document.addEventListener('pointermove', onPointerMove);

  document.onpointerup = () => {
    document.removeEventListener('pointermove', onPointerMove);
    contentLine.pointerup = null
    autoscroll = setInterval(scrollContentLine, 4000)
  }
  contentLine.ondragstart = () => {
    return false;
  }
}