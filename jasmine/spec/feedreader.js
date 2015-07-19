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
         * empty. 
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* A test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('all have a url', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* A test that loops through each feed
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


    describe('The menu', function() {
        var menu;

        beforeEach(function() {
            menu = $('.menu');
        });

        /*  A test that ensures the menu element is
         * hidden by default, but confirming that the position 
         * of the menu is off the screen.
         */
        it('is hidden when the page loads', function(){
            expect(document.body.className).toBe('menu-hidden');
            expect(-menu.position().left).toBeGreaterThan(menu.width());
        });
         /* A test that ensures the menu changes
          * visibility when the menu icon is clicked. Since the menu 
          * position changes based on whether the body has the class 
          * "menu-hidden" or not, test id to ensure that is appropriately added.
          */
        it('should be visible when the menu icon is clicked', function() {
            var menuIcon = $('.menu-icon-link');
            menuIcon.click();
            expect(document.body.className).not.toBe('menu-hidden');
            menuIcon.click();
            expect(document.body.className).toBe('menu-hidden');
        });

        /* Test to ensure that the menu content is loading correctly
        */
        it('has a name entry for each feed', function() {
            var menuItems = $('.menu > ul > li > a');
            expect(menuItems.length).toEqual(allFeeds.length);
            for (var i = 0; i < allFeeds.length; i++){
                expect(menuItems[i].text).toEqual(allFeeds[i].name);
            }
        });
    });

    describe('Initial entries', function() {
        /* A test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * loadFeed() is asynchronous so this test requires
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

    describe('New Feed Selection', function() {
        /* A test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         */

        /* Getting the whole block of html seems reasonable
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

    describe('The Feed Manager', function() {
        /* Future functionality: allFeeds is either the default object
         * given or if present, then an object stored in localStoreage.
         * Tests are based on an object called feedManager that provides
         * getFeeds(), addFeed(name, url), delFeed(id) and resetFeeds() methods.
        */

        // Placeholder feedManager object; fakes the function of the real object, for later.
        var feedManager = {
            getFeeds: function () {
                if (!this.pretendStore) {this.pretendStore = JSON.parse(JSON.stringify(allFeeds))}
                return this.pretendStore;
            },
            addFeed: function (name, url) {
                this.pretendStore.push({name: name, url: url});
            },
            delFeed: function (id) {
                this.pretendStore.splice(id, 1);
            },
            resetFeeds: function () {
                this.pretendStore = allFeeds;
            }
        };

        var testName = 'Test Feed';
        var testUrl = 'http://www.example.com';

        it('retrieves feeds when getFeeds is called', function() {
            var feeds = feedManager.getFeeds();
            expect(feeds).toEqual(allFeeds);
        });

        it('saves new feeds and retrieves them later', function() {
            feedManager.addFeed(testName, testUrl);
            var feeds = feedManager.getFeeds();
            newFeed = feeds[feeds.length -1];
            expect(newFeed.name).toEqual(testName);
            expect(newFeed.url).toEqual(testUrl);
        });

        it('removes feeds with the delFeeds method', function() {
            var feeds = feedManager.getFeeds();
            var feedlength = feeds.length;
            feedManager.delFeed(4);
            feeds = feedManager.getFeeds();
            expect(feeds.length).toEqual(feedlength - 1);
            expect(feeds[feeds.length-1].name).not.toEqual(testName);
        });

        it('resets the feeds to the initial values when resetFeeds is called', function() {
            feedManager.resetFeeds();
            var feeds = feedManager.getFeeds();
            expect(feeds).toEqual(allFeeds);
        });
    });
}());
