describe('Unlock client tests', function(){
    beforeEach(function(){
        $('#email').val('');
    });

    it('should be avaiable', function(){
        expect(window.Unlock).to.be.an('object');
    });

    it('should have an init function', function(){
        expect(window.Unlock.init).to.be.a('function');
    });

    describe('Option validation', function(){
        it('should fail if not given any options', function(){
            expect(Unlock.init.bind()).to.throw();
        });

        it('should fail if given an empty options object', function(){
            expect(Unlock.init.bind(undefined, {})).to.throw();
        });

        it('should fail if no url is given', function(){
            expect(Unlock.init.bind(undefined, {
                email: '#email',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if no email field is given', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if no onMessage function is given', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email'
            })).to.throw();
        });

        it('should fail if url is not a string', function(){
            expect(Unlock.init.bind(undefined, {
                url: 8,
                email: '#email',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if email is not a string', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: true,
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if onMessage is not a function', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: 'onMessage'
            })).to.throw();
        });

        it('should fail if extra is passed and is not an object', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){},
                extra: 'otherstuff'
            })).to.throw();
        });

        it('should fail if submitOnEnter is passed and is not a boolean', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){},
                submitOnEnter: 12
            })).to.throw();
        });

        it('should fail if color is passed and is not a string', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){},
                color: 0x2311f6
            })).to.throw();
        });

        it('should fail if an unknown option is passed', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){},
                badOption: true
            })).to.throw();
        });

        it('should fail if there is no element with the given id for email', function(){
            expect(Unlock.init.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'noemail',
                onMessage: function(){}
            })).to.throw();
        });

        describe('Color validation', function(){
            it ('should fail if color is not a valid hex number', function(){
                expect(Unlock.init.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#ff190g'
                })).to.throw();
            });

            it('should fail if color isn\'t 3 or 6 hex characters', function(){
                var chars=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
                for (var i=0; i<10; i++){
                    if (i===3||i===6){
                        continue;
                    }
                    var color='#';
                    for (var j=0; j<i; j++){
                        color+=_.sample(chars);
                    }
                    expect(Unlock.init.bind(undefined, {
                        url: 'ws://localhost:3456',
                        email: '#email',
                        onMessage: function(){},
                        color: color
                    })).to.throw();
                }
            });

            it('should fail if given an rgba color', function(){
                expect(Unlock.init.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgba(225, 86, 9, 0.5)'
                })).to.throw();
            });

            it('should fail if given an rgb color with values out of range', function(){
                expect(Unlock.init.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(-4, 16, 55)'
                })).to.throw();
                expect(Unlock.init.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(109, 76, 743)'
                })).to.throw();
            });
        });
    });

    describe('Color normalization', function(){
        it ('should default to blue if no color is specified', function(){
            var u=Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){}
            });
            expect(u.opts.color).to.equal('#2f81c6');
        });

        describe('Six character hex', function(){
            it('should set a color if specified', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#6741f0'
                });
                expect(u.opts.color).to.be.a('string');
            });

            it('should work without a leading hash', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '2258e3'
                });
                expect(u.opts.color).to.equal('#2258e3');
            });

            it('should convert hex digits to lowercase', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#ABCDEF'
                });
                expect(u.opts.color).to.equal('#abcdef');
            });
        });

        describe('Three character hex', function(){
            it('should set a color if specified', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#28c'
                });
                expect(u.opts.color).to.be.a('string');
            });

            it('should expand the color to six characters and a hash', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#41b'
                });
                expect(u.opts.color[0]).to.equal('#');
                expect(u.opts.color).to.have.lengthOf(7);
            });

            it('should work without a leading hash', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '513'
                });
                expect(u.opts.color).to.equal('#551133');
            });

            it('should convert hex digits to lowercase', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: '#ABC'
                });
                expect(u.opts.color).to.equal(u.opts.color.toLowerCase());
            });
        });

        describe('rgb', function(){
            it('should set a color if specified', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(12, 24, 36)'
                });
                expect(u.opts.color).to.be.a('string');
            });

            it('should work without spaces', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(12,15,108)'
                });
                expect(u.opts.color).to.equal('#0c0f6c');
            });

            it('should work with spaces', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(72, 212, 89)'
                });
                expect(u.opts.color).to.equal('#48d459');
            });

            it('should work with some spaces', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(123, 0,60)'
                });
                expect(u.opts.color).to.equal('#7b003c');
            });

            it('should return lowercase hex with six characters', function(){
                var u=Unlock.init({
                    url: 'ws://localhost:3456',
                    email: '#email',
                    onMessage: function(){},
                    color: 'rgb(96, 38, 59)'
                });
                expect(u.opts.color[0]).to.equal('#');
                expect(u.opts.color).to.equal(u.opts.color.toLowerCase());
                expect(u.opts.color).to.have.lengthOf(7);
            });
        });
    });

    describe('Socket', function(){
        it('should connect', function(done){
            var u=Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){
                    done();
                }
            });
            $('#email').val('a@a.com');
            u.unlock();
        });
    });

    describe('Unlock button', function(){
        it('should insert button html into page', function(){
            Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){}
            });
            expect($('#unlock-button button').length).to.equal(1);
        });

        it('should send a request when enter is pressed if submitOnEnter is true', function(done){
            var u=Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){
                    u.opts.onMessage=()=>{};
                    done();
                },
                submitOnEnter: true
            });
            var enter=$.Event('keyup', {
                which: 13,
                keyCode: 13
            });
            $('#email').val('a@a.com');
            $('#email').trigger(enter);
        });

        it('should not send a request when enter is pressed if submitOnEnter is false', function(done){
            var u=Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){
                    done('Message was sent');
                },
                submitOnEnter: false
            });
            var enter=$.Event('keyup', {
                which: 13,
                keyCode: 13
            });
            $('#email').val('b@b.com');
            $('#email').trigger(enter);
            setTimeout(function(){
                done();
            }, 500);
        });

        it('should set the color of the button to blue by default', function(){
            Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){}
            });
            expect($('#unlock-button button').css('background-color')).to.equal('rgb(47, 129, 198)');
        });

        it('should be able to specify a color for the button', function(){
            Unlock.init({
                url: 'ws://localhost:3456',
                email: '#email',
                onMessage: function(){},
                color: 'rgb(128, 30, 29)'
            });
            expect($('#unlock-button button').css('background-color')).to.equal('rgb(128, 30, 29)');
        });
    });
});
