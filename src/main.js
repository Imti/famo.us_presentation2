define(function(require, exports, module) {
    // Requires
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');

    // create mainContext that we'll  
    // add our modifiers and views to
    var mainContext = Engine.createContext();

    // let's have different options of scrolling  
    // so we can toggle and try out the different 
    // scrolling experiences
    var outputTypeEnum = {
        Z_SCROLLER : 0,
        CAROUSEL : 1,
        HELIX : 2
    }

    // select your experience here
    var outputType = outputTypeEnum.HELIX;

    // create scrollview
    var scrollview = new Scrollview({
        // changing the 2 numbers after the question 
        // mark changes the visibility of slides
        margin: (outputType == outputTypeEnum.HELIX ? 200000 : 100000),
        // scroll view options 
        // (still playing around with 
        // these to figure out what they do)
        direction: 1,
        paginated: true,
        pagePeriod: 500,
        pageSwitchSpeed: 10,
        speedLimit: 10,
    });

    // keep track of all our slides
    var slides = [];

    // let the scrollview sequence 
    // through our array of slides
    scrollview.sequenceFrom(slides);

    // send all scrollview events
    // to the Engine
    Engine.pipe(scrollview);

    // text content for each surface
    var text = [
        "<br/><br/> Second Presentation Using Famo.us",
    ];

    for(var i = 1; i < 10; i++) {
        text.push("<br/><br/> Slide #" + i);
    }

    // for each text content, make a new slide
    for(var i = 0; i < text.length; i++) {
        var slide = new Surface({
            // setting size to undefined
            // makes it full screen
            size: [undefined, undefined],
            content: text[i],
            properties: {
                fontSize: '80px',
                lineHeight: '80px',
                textAlign: 'center',
                // rainbow colors
                backgroundColor: "hsl(" + (i * 360 / 50) + ", 100%, 50%)",
                // make both sides of slides visible
                webkitBackFaceVisibility: 'visible',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
            }
        });
        //slide.pipe(scrollview);
        slides.push(slide);
    }

    // mainModifier to apply to the mainContext
    var mainModifier = new StateModifier({
        size: [undefined, undefined],
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
    });

    // add the mainModifier and the 
    // scrollview to the mainContext
    mainContext.add(mainModifier).add(scrollview);

    // set perspective of screen
    // lower perspective -> more dramatic
    mainContext.setPerspective(400);

    // get offset and provide different cases
    // for each of the scroll types
    scrollview.outputFrom(function(offset) {
        switch(outputType) {
            case (outputTypeEnum.Z_SCROLLER): 
                return Transform.translate(offset/2, offset/2, offset);
            case (outputTypeEnum.CAROUSEL):
                return Transform.moveThen([0, 0, 500], Transform.rotateY(0.003 * offset));
            case (outputTypeEnum.HELIX):
                return Transform.moveThen([0, offset/4, 300], Transform.rotateY(0.005 * offset));
        }
        
    });


});
