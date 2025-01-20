export const scrollDown = () => {
  console.log("Scrolling down");
  console.log(window.innerHeight);
  //   add smooth scrolling
  window.scroll({
    top: window.innerHeight,
    behavior: "smooth",
  });
};

export const scrollUp = () => {
  console.log("Scrolling up");
  window.scroll({
    top: -window.innerHeight,
    behavior: "smooth",
  });
};

export const clickOnElement = (id, className) => {
  console.log("Clicking on element");
  if (id) {
    document.getElementById(id).click();
  } else if (className) {
    console.log(document.getElementsByClassName(className));
    document.getElementsByClassName(className)[0].click();
  }
};

export const goBack = () => {
  console.log("Going back");
  window.history.back();
};

export const goForward = () => {
  console.log("Going forward");
  window.history.forward();
};

export const reloadPage = () => {
  console.log("Reloading page");
  window.location.reload();
};

export const openNewTab = (url) => {
  // console.log("Opening new tab");
  // window.open(url, "_blank");
  window.location.href = url;
};

export const closeTab = () => {
  console.log("Closing tab");
  window.close();
};

export const typeOnTheInputBox = (className, text) => {
  console.log("Typing on the input box");
  document.getElementsByClassName(className)[0].value = text;
};
