/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('all have a url', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('all have a name', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {
        var menu;
        
        beforeEach(function() {
            menu = $('.menu');
        });
        
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden when the page loads', function(){
            expect(document.body.className).toBe('menu-hidden');
            expect(-menu.position().left).toBeGreaterThan(menu.width());
        });
         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        it('should be visible when the menu icon is clicked', function() {
            var menuIcon = $('.menu-icon-link');
            menuIcon.click();
            expect(document.body.className).not.toBe('menu-hidden');
            menuIcon.click();
            expect(document.body.className).toBe('menu-hidden');
            //expect(-menu.position().left).toBeLessThan(192); TODO: test after transitions?
        });
    });
    
    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial entries', function() {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        
        /* Before the test, remove the container that hold the feed information. 
         * if the loadFeed function completes, it should have constructed the content again.
         * Removing the content removes the possibility of confirming falsely 
         * when the function didn't work and the content is old content.
         */
        beforeEach(function(done){
            loadFeed(1, done);
        });
        
        it('are loaded', function(done) {
            menu = $('article');
            expect(menu.length).toBeGreaterThan(0);
            done();
        });
        
        afterAll(function(done) {
            loadFeed(0, done);
        })
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
         
        /* Comment: getting the whole block of html seems reasonable 
         * since it should be character-by-character identical. 
         * Tested this by loading entry 1 twice, test failed as expected 
         * since html generated was the same. This test would fail however 
         * if the feed were updated right then.
        */
        var feedText = '';
        var newfeedText = '';
        
        beforeEach(function(done){
            loadFeed(1, function() {
                feedText = $('.feed').html();
                loadFeed(3, function() {
                    done();
                });
            });
        });
        
        it('has new content after a new feed loads', function(done) {
            newfeedText = $('.feed').html();
            expect(feedText).not.toEqual('');
            expect(newfeedText).not.toEqual(feedText);
            done();
        });
        
        afterAll(function(done) {
            loadFeed(0, done);
        });
    });
    
    
}());
