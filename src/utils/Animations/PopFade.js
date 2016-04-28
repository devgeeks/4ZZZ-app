function popFadeIn(action, component, done) {
  if (action === 'push') {
    requestAnimationFrame(() => {
      component.setState({
        style: {
          transform: 'scale(0.95, 0.95)',
          WebkitTransform: 'scale(0.95, 0.95)',
          opacity: 0.01,
          zIndex: 2,
        },
      });
      requestAnimationFrame(() => {
        component.setState({
          style: {
            transform: 'scale(1, 1)',
            WebkitTransform: 'scale(1, 1)',
            transition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            WebkitTransition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            transitionProperty: 'transform, opacity',
            WebkitTransitionProperty: '-webkit-transform, opacity',
            opacity: 1,
            zIndex: 2,
          },
        });
        done();
      });
    });
  } else {
    requestAnimationFrame(() => {
      component.setState({
        style: {
          transform: 'scale(0.95, 0.95)',
          WebkitTransform: 'scale(0.95, 0.95)',
          opacity: 0.01,
          zIndex: 1,
        },
      });
      requestAnimationFrame(() => {
        component.setState({
          style: {
            transform: 'scale(1, 1)',
            WebkitTransform: 'scale(1, 1)',
            transition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            WebkitTransition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            transitionProperty: 'transform, opacity',
            WebkitTransitionProperty: '-webkit-transform, opacity',
            opacity: 1,
            zIndex: 1,
          },
        });
        done();
      });
    });
  }
}

function popFadeOut(action, component, done) {
  if (action === 'push') {
    requestAnimationFrame(() => {
      component.setState({
        style: {
          transform: 'scale(1, 1)',
          WebkitTransform: 'scale(1, 1)',
          opacity: 1,
          zIndex: 1,
        },
      });
      requestAnimationFrame(() => {
        component.setState({
          style: {
            transform: 'scale(0.95, 0.95)',
            WebkitTransform: 'scale(0.95, 0.95)',
            transition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            transitionProperty: 'transform, opacity',
            WebkitTransition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            WebkitTransitionProperty: '-webkit-transform, opacity',
            opacity: 0.7,
            zIndex: 1,
          },
        });
        setTimeout(done, 300);
      });
    });
  } else {
    requestAnimationFrame(() => {
      component.setState({
        style: {
          transform: 'scale(1, 1)',
          WebkitTransform: 'scale(1, 1)',
          opacity: 1,
          zIndex: 2,
        },
      });
      requestAnimationFrame(() => {
        component.setState({
          style: {
            transform: 'scale(0.95, 0.95)',
            WebkitTransform: 'scale(0.95, 0.95)',
            transition: 'all .4s cubic-bezier(.1, 1, .5, 1)',
            transitionProperty: 'transform, opacity',
            WebkitTransition: '-webkit-transform .4s cubic-bezier(.1, 1, .5, 1)',
            WebkitTransitionProperty: '-webkit-transform, opacity',
            opacity: 0.01,
            zIndex: 2,
          },
        });
        setTimeout(done, 300);
      });
    });
  }
}

export default (component, options, done) => {
  const { action, direction } = options;
  if (direction === 'in') {
    popFadeIn(action, component, done);
  } else {
    popFadeOut(action, component, done);
  }
};
