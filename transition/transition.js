function resolveDuration(el, type, duration) {
  if (type === "transition") {
    el.style.transitionDuration = `${duration}ms`;
  } else if (type === "animation") {
    el.style.animationDuration = `${duration}ms`;
  }
}

function removeClass(el, classes = []) {
  classes.forEach((className) => {
    el.classList.remove(className);
  });
}

class Transition {
  constructor(el, options) {
    const { type, duration, name } = options;
    this.el = el;
    this.type = type;
    this.duration = duration;
    this.name = name;
    this.enterFromClass = `${name}-enter-from`;
    this.enterActiveClass = `${name}-enter-active`;
    this.enterToClass = `${name}-enter-to`;
    this.appearFromClass = this.enterFromClass;
    this.appearActiveClass = this.enterActiveClass;
    this.appearToClass = this.enterToClass;
    this.leaveFromClass = `${name}-leave-from`;
    this.leaveActiveClass = `${name}-leave-active`;
    this.leaveToClass = `${name}-leave-to`;
    this.animationEndEvent = this.getAnimationEndEvent();
    this.enterHooks = [];
    this.leaveHooks = [];
  }

  enter() {
    this.el.addEventListener(this.animationEndEvent, this.enterComplete);

    this.el.style.display = "block";

    resolveDuration(this.el, this.type, this.duration);
    removeClass(this.el, [
      this.leaveFromClass,
      this.leaveToClass,
      this.leaveActiveClass,
    ]);

    this.el.classList.add(this.enterFromClass);

    requestAnimationFrame(() => {
      this.el.classList.add(this.enterActiveClass);

      removeClass(this.el, [this.enterFromClass]);
      if (this.type === "transition") {
        this.el.classList.add(this.enterToClass);
      }
    });

    this.callHooks(this.enterHooks);
  }

  leave() {
    this.el.addEventListener(this.animationEndEvent, this.leaveComplete);
    resolveDuration(this.el, this.type, this.duration);

    removeClass(this.el, [
      this.enterFromClass,
      this.enterActiveClass,
      this.enterToClass,
    ]);

    this.el.classList.add(this.leaveFromClass);

    requestAnimationFrame(() => {
      this.el.classList.add(this.leaveActiveClass);

      removeClass(this.el, [this.leaveFromClass]);

      if (this.type === "transition") {
        this.el.classList.add(this.leaveToClass);
      }
    });

    this.callHooks(this.leaveHooks);
  }

  enterComplete = () => {
    console.log("enterComplete");
    this.el.style.transition = "";
    this.el.style.animationDuration = "";

    this.el.classList.remove(this.enterFromClass);
    this.el.classList.remove(this.enterActiveClass);
    this.el.classList.remove(this.enterToClass);

    this.el.removeEventListener(this.animationEndEvent, this.enterComplete);
  };

  leaveComplete = () => {
    console.log("leaveComplete");
    this.el.style.transition = "";
    this.el.style.animationDuration = "";

    this.el.style.display = "none";

    this.el.classList.remove(this.leaveFromClass);
    this.el.classList.remove(this.leaveActiveClass);
    this.el.classList.remove(this.leaveToClass);

    this.el.removeEventListener(this.animationEndEvent, this.leaveComplete);
  };

  beforeEnter(hook) {
    this.enterHooks.push(hook);
  }

  beforeLeave(hook) {
    this.leaveHooks.push(hook);
  }

  callHooks(hooks) {
    hooks.forEach((hook) => {
      if (typeof hook === "function") {
        hook(this.el);
      }
    });
  }

  getAnimationEndEvent() {
    // const element = document.createElement("fakeelement");
    // const animations = {
    //   animation: "animationend",
    //   OAnimation: "oAnimationEnd",
    //   MozAnimation: "animationend",
    //   WebkitAnimation: "webkitAnimationEnd",
    // };

    // for (let animation in animations) {
    //   if (element.style[animation] !== undefined) {
    //     console.log("element.style[animation]", animations[animation]);
    //     return animations[animation];
    //   }
    // }

    return `${this.type}end`;
  }
}
