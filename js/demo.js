/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    // The Slide class.
    class Slide {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.imgWrap = this.DOM.el.querySelector('.slide__img-wrap');
            this.DOM.img = this.DOM.imgWrap.querySelector('.slide__img');
            this.DOM.revealer = this.DOM.imgWrap.querySelector('.slide__img-reveal');
            this.DOM.title = this.DOM.el.querySelector('.slide__title');
            this.DOM.titleBox = this.DOM.title.querySelector('.slide__box');
            this.DOM.titleInner = this.DOM.title.querySelector('.slide__title-inner');
            this.DOM.subtitle = this.DOM.el.querySelector('.slide__subtitle');
            this.DOM.subtitleBox = this.DOM.subtitle.querySelector('.slide__box');
            this.DOM.subtitleInner = this.DOM.subtitle.querySelector('.slide__subtitle-inner');
            this.DOM.quote = this.DOM.el.querySelector('.slide__quote');
            this.DOM.explore = this.DOM.el.querySelector('.slide__explore');
            // Some config values.
            this.config = {
                revealer: {
                    // Speed and ease for the revealer animation.
                    speed: {hide: 0.5, show: 0.7},
                    ease: {hide: 'Quint.easeOut', show: 'Quint.easeOut'}
                }
            };
            // init/bind events.
            this.initEvents();
        }
        initEvents() {
            this.mouseenterFn = () => {
                // hover on the "explore" link: scale up the img element.
                if ( this.isPositionedCenter() ) {
                    this.zoom({scale: 1.2, speed: 2, ease: 'Quad.easeOut'});
                    /*TweenMax.to(this.DOM.explore.querySelector('.slide__explore-inner'), 0.3, {
                        y: '-100%'
                    });*/
                }
            };
            this.mouseleaveFn = () => {
                // hover on the "explore" link: reset the scale of the img element.
                if ( this.isPositionedCenter() ) {
                    this.zoom({scale: 1.1, speed: 2, ease: 'Quad.easeOut'});
                    /*TweenMax.to(this.DOM.explore.querySelector('.slide__explore-inner'), 0.3, {
                        startAt: {y: '100%'},
                        y: '0%'
                    });*/
                }
            };
            this.DOM.explore.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.explore.addEventListener('mouseleave', this.mouseleaveFn);
        }
        // set the class current.
        setCurrent(hideBefore = true) {
            this.isCurrent = true;

            if ( hideBefore ) {
                // Hide the image.
                this.showRevealer({animation: false});
                // And the texts.
                this.DOM.titleInner.style.opacity = 0;
                this.DOM.subtitleInner.style.opacity = 0;
                this.DOM.titleBox.style.opacity = 0;
                this.DOM.subtitleBox.style.opacity = 0;
                this.DOM.explore.style.opacity = 0;
            }

            this.DOM.el.classList.add('slide--current', 'slide--visible');
        }
        // Set the class left.
        setLeft(hideBefore = true) {
            this.isRight = this.isCurrent = false;
            this.isLeft = true;
            // Show the revealer and reset the texts that are visible for the left and right slides.
            if ( hideBefore ) {
                this.resetLeftRight();
            }
            this.DOM.el.classList.add('slide--left', 'slide--visible');
        }
        // Set the class right.
        setRight(hideBefore = true) {
            this.isLeft = this.isCurrent = false;
            this.isRight = true;
            // Show the revealer and reset the texts that are visible for the left and right slides.
            if ( hideBefore ) {
                this.resetLeftRight();
            }
            this.DOM.el.classList.add('slide--right', 'slide--visible');
        }
        // Show the revealer and reset the texts that are visible for the left and right slides.
        resetLeftRight() {
            this.showRevealer({animation: false});
            // Reset texts.
            this.DOM.titleInner.style.opacity = 0;
            this.DOM.titleInner.style.transform = 'none';
        }
        // Check if the slide is positioned on the right side (if it´s the next slide in the slideshow).
        isPositionedRight() {
            return this.isRight;
        }
        // Check if the slide is positioned on the left side (if it´s the previous slide in the slideshow).
        isPositionedLeft() {
            return this.isLeft;
        }
        // Check if the slide is the current one.
        isPositionedCenter() {
            return this.isCurrent;
        }
        // Shows the white container on top of the image.
        showRevealer(opts = {}) {
            return this.toggleRevealer('hide', opts);
        }
        // Hides the white container on top of the image.
        hideRevealer(opts = {}) {
            return this.toggleRevealer('show', opts);
        }
        toggleRevealer(action, opts) {
            return new Promise((resolve, reject) => {
                if ( opts.animation ) {
                    TweenMax.to(this.DOM.revealer, opts.speed || this.config.revealer.speed[action], {
                        delay: opts.delay || 0,
                        ease: opts.ease || this.config.revealer.ease[action],
                        startAt: action === 'hide' ? {y: opts.direction === 'prev' ? '-100%' : '100%'} : {},
                        y: action === 'hide' ? '0%' : opts.direction === 'prev' ? '100%' : '-100%',
                        onComplete: resolve
                    });
                }
                else {
                    this.DOM.revealer.style.transform = action === 'hide' ? 
                        'translate3d(0,0,0)' :
                        `translate3d(0,${opts.direction === 'prev' ? '100%' : '-100%'},0)`

                    resolve();
                }
            });
        }
        // Hide the slide.
        hide(direction, delay) {
            return this.toggle('hide', direction, delay);
        }
        // Show the slide.
        show(direction, delay) {
            return this.toggle('show', direction, delay);
        }
        // Show/Hide the slide.
        toggle(action, direction, delay) {
            // Zoom in/out the image
            this.zoom({
                scale: action === 'hide' ? 1.2 : 1.1, 
                speed: action === 'hide' ? this.config.revealer.speed[action] : this.config.revealer.speed[action]*2.5,
                ease: this.config.revealer.ease[action],
                startAt: action === 'show' ? {scale: 1} : {},
                delay: delay
            });
            // Hide/Show the slide´s texts.
            if ( action === 'hide' ) {
                this.hideTexts(direction, delay);
            }
            else {
                this.showTexts(direction, delay);
            }
            // Hide/Show revealer on top of the image
            return this[action === 'hide' ? 'showRevealer' : 'hideRevealer']({delay: delay, direction: direction, animation: true});
        }
        hideTexts(direction, delay) {
            this.toggleTexts('hide',direction, delay);
        }
        showTexts(direction, delay) {
            this.toggleTexts('show',direction, delay);
        }
        toggleTexts(action, direction, delay) {
            if ( this.isPositionedCenter() ) {
                this.DOM.titleBox.style.transformOrigin = this.DOM.subtitleBox.style.transformOrigin = action === 'hide' ? '100% 50%' : '0% 50%';

                const speed = action === 'hide' ? 0.2 : 0.6;
                const ease = action === 'hide' ? 'Power3.easeInOut' : 'Expo.easeOut';

                TweenMax.to(this.DOM.titleInner, speed, {
                    ease: ease,
                    delay: action === 'hide' ? delay : delay + 0.2,
                    startAt: action === 'show' ? {x: '-100%'} : {},
                    x: action === 'hide' ? '100%' : '0%',
                    opacity: action === 'hide' ? 0 : 1
                });

                TweenMax.to(this.DOM.titleBox, speed, {
                    ease: ease,
                    delay: action === 'hide' ? delay + 0.2 : delay,
                    startAt: action === 'show' ? {scaleX: 0} : {},
                    scaleX: action === 'hide' ? 0 : 1,
                    opacity: 1
                });

                TweenMax.to(this.DOM.subtitleInner, speed, {
                    ease: ease,
                    delay: action === 'hide' ? delay + 0.3 : delay + 0.5,
                    startAt: action === 'show' ? {x: '-100%'} : {},
                    x: action === 'hide' ? '100%' : '0%',
                    opacity: action === 'hide' ? 0 : 1
                });

                TweenMax.to(this.DOM.subtitleBox, speed, {
                    ease: ease,
                    delay: action === 'hide' ? delay + 0.5 : delay + 0.3,
                    startAt: action === 'show' ? {scaleX: 0} : {},
                    scaleX: action === 'hide' ? 0 : 1,
                    opacity: 1
                });

                TweenMax.to(this.DOM.explore, speed, {
                    ease: ease,
                    delay: delay + 0.2,
                    startAt: action === 'show' ? {y: '100%'} : {},
                    y: action === 'hide' ? '-100%' : '0%',
                    opacity: action === 'hide' ? 0 : 1
                });
            }
            else {
                TweenMax.to(this.DOM.titleInner, this.config.revealer.speed.hide, {
                    ease: 'Quint.easeOut',
                    delay: delay,
                    startAt:  action === 'show' ? {x: direction === 'next' ? '-50%' : '50%', opacity: 0} : {},
                    x:  action === 'show' ? '0%' : direction === 'next' ? '50%' : '-50%',
                    opacity: action === 'hide' ? 0 : 1
                });
            }
        }
        load() {
            // Scale up the images.
            this.zoom({
                scale: 1.1, 
                speed: this.config.revealer.speed['show']*2.5,
                ease: this.config.revealer.ease.hide
            });
            // For the current also animate in the "explore" link.
            if ( this.isPositionedCenter() ) {
                TweenMax.to(this.DOM.explore, this.config.revealer.speed['show']*2.5, {
                    ease: this.config.revealer.ease.hide,
                    startAt: {y: '100%', opacity: 0},
                    y: '0%',
                    opacity: 1
                });
            }
        }
        // Zooms in/out the image.
        zoom(opts = {}) {
            TweenMax.to(this.DOM.img, opts.speed || 1, {
                startAt: opts.startAt || {},
                delay: opts.delay || 0,
                scale: opts.scale || 1,
                ease: opts.ease || 'Quint.easeOut'
            });
        }
        // Reset classes and state.
        reset() {
            this.isRight = this.isLeft = this.isCurrent = false;
            this.DOM.el.classList = 'slide';
        }
    }

    // The Slideshow class.
    class Slideshow {
        constructor(el) {
            this.DOM = {el: el};
            // The slides.
            this.slides = [];
            Array.from(this.DOM.el.querySelectorAll('.slide')).forEach(slideEl => this.slides.push(new Slide(slideEl)));
            // The total number of slides.
            this.slidesTotal = this.slides.length;
            // At least 3 slides to continue...
            if ( this.slidesTotal < 3 ) {
                return false;
            }
            // Current slide position.
            this.current = 0;
            // Set the current/right/left slides. 
            // Passing false indicates we dont need to show the revealer (white container that hides the images) on the images.
            this.render(false);
            // Init/Bind events.
            this.initEvents();
        }
        render(hideSlidesBefore = false) {
            // The current, next, and previous slides.
            this.currentSlide = this.slides[this.current];
            this.nextSlide = this.slides[this.current+1 <= this.slidesTotal-1 ? this.current+1 : 0];
            this.prevSlide = this.slides[this.current-1 >= 0 ? this.current-1 : this.slidesTotal-1];
            // Set the classes.
            this.currentSlide.setCurrent(hideSlidesBefore);
            this.nextSlide.setRight(hideSlidesBefore);
            this.prevSlide.setLeft(hideSlidesBefore);
        }
        // Set the animations for the slides when the slideshow gets revealed initially (scale up images and animate some of the texts)
        load() {
            [this.nextSlide,this.currentSlide,this.prevSlide].forEach(slide => slide.load());
        }
        initEvents() {
            // Clicking the next and previous slide.
            this.navigateFn = (slide) => {
                if ( slide.isPositionedRight() ) {
                    this.navigate('next');
                }
                else if ( slide.isPositionedLeft() ) {
                    this.navigate('prev');
                }
            };
            for (let slide of this.slides) {
                slide.DOM.imgWrap.addEventListener('click', () => this.navigateFn(slide));
            }
        }
        hideSlides(direction) {
            return this.toggleSlides('hide', direction);
        }
        updateSlides() {
            // Reset current visible slides, by removing the right/left/current and visible classes.
            [this.nextSlide,this.currentSlide,this.prevSlide].forEach(slide => slide.reset());
            // Set the new left/right/current slides and make sure the revealer is shown on top of them (hide its images).
            this.render(true);
        }
        showSlides(direction) {
            return this.toggleSlides('show', direction);
        }
        // Show/Hide the slides, each with a delay.
        toggleSlides(action, direction) {
            const delayFactor = 0.2;
            let processing = [];
            
            [this.nextSlide,this.currentSlide,this.prevSlide].forEach(slide => {
                let delay = slide.isPositionedCenter() ? delayFactor/2 :
                            direction === 'next' ? slide.isPositionedRight() ? 0 : delayFactor :
                            slide.isPositionedRight() ? delayFactor : 0;

                processing.push(slide[action](direction, delay));
            });
            
            return Promise.all(processing);
        }
        // Navigate the slideshow.
        navigate(direction) {
            // If animating return.
            if ( this.isAnimating ) return;
            this.isAnimating = true;

            // Update current.
            this.current = direction === 'next' ? 
                    this.current < this.slidesTotal-1? this.current+1 : 0 :
                    this.current = this.current > 0 ? this.current-1 : this.slidesTotal-1;

            // Hide the current visible slides (left, right and current),
            // then switch and show the new slides.
            this.hideSlides(direction)
                .then(() => this.updateSlides())
                .then(() => this.showSlides(direction))
                .then(() => this.isAnimating = false);
        }
    }

    const slideshow = new Slideshow(document.querySelector('.slideshow'));

    // Preload all the images in the page..
    const loader = document.querySelector('.loader');
    imagesLoaded(document.querySelectorAll('.slide__img'), () => {
        setTimeout(() => {
            // Hide loader panel (animate up)
            TweenMax.to(loader, 1, {
                ease: 'Quint.easeOut',
                y: '-100%'
            });
            // Set the animations for the slides when the slideshow gets revealed initially (scale up images and animate some of the texts)
            slideshow.load();
        }, 400); // Just for demo purposes let´s add 400ms to the images loading time..
    });
}
