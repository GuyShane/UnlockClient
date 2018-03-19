describe('Unlock client tests', function(){
    it('should be avaiable', function(){
        expect(window.Unlock).to.be.a('function');
    });

    describe('Option validation', function(){
        it('should fail if not given any options', function(){
            expect(Unlock.bind()).to.throw();
        });

        it('should fail if given an empty options object', function(){
            expect(Unlock.bind(undefined, {})).to.throw();
        });

        it('should fail if no url is given', function(){
            expect(Unlock.bind(undefined, {
                email: 'email',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if no email field is given', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if no onMessage function is given', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email'
            })).to.throw();
        });

        it('should fail if url is not a string', function(){
            expect(Unlock.bind(undefined, {
                url: 8,
                email: 'email',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if email is not a string', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: true,
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if onMessage is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: 'onMessage'
            })).to.throw();
        });

        it('should fail if button is passed and is not a boolean', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                button: 'false'
            })).to.throw();
        });

        it('should fail if color is passed and is not a string', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                color: 0x2311f6
            })).to.throw();
        });

        it('should fail if onOpen is passed and is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: 'open'
            })).to.throw();
        });

        it('should fail if onClose is passed and is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onClose: false
            })).to.throw();
        });

        it('should fail if an unknown option is passed', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                badOption: true
            })).to.throw();
        });

        it('should fail if there is no element with the given id for email', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost:3456',
                email: 'noemail',
                onMessage: function(){}
            })).to.throw();
        });

        describe('Color validation', function(){
            it ('should fail if color is not a valid hex number', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: 'email',
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
                    expect(Unlock.bind(undefined, {
                        url: 'ws://localhost:3456',
                        email: 'email',
                        onMessage: function(){},
                        color: color
                    })).to.throw();
                }
            });

            it('should fail if given an rgba color', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgba(225, 86, 9, 0.5)'
                })).to.throw();
            });

            it('should fail if given an rgb color with values out of range', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(-4, 16, 55)'
                })).to.throw();
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(109, 76, 743)'
                })).to.throw();
            });
        });
    });

    describe('Color normalization', function(){
        it ('should default to blue if no color is specified', function(){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){}
            });
            expect(u.color).to.equal('#2f81c6');
        });

        describe('Six character hex', function(){
            it('should set a color if specified', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '#6741f0'
                });
                expect(u.color).to.be.a('string');
            });

            it('should work without a leading hash', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '2258e3'
                });
                expect(u.color).to.equal('#2258e3');
            });

            it('should convert hex digits to lowercase', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '#ABCDEF'
                });
                expect(u.color).to.equal('#abcdef');
            });
        });

        describe('Three character hex', function(){
            it('should set a color if specified', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '#28c'
                });
                expect(u.color).to.be.a('string');
            });

            it('should expand the color to six characters and a hash', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '#41b'
                });
                expect(u.color[0]).to.equal('#');
                expect(u.color).to.have.lengthOf(7);
            });

            it('should work without a leading hash', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '513'
                });
                expect(u.color).to.equal('#551133');
            });

            it('should convert hex digits to lowercase', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: '#ABC'
                });
                expect(u.color).to.equal(u.color.toLowerCase());
            });
        });

        describe('rgb', function(){
            it('should set a color if specified', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(12, 24, 36)'
                });
                expect(u.color).to.be.a('string');
            });

            it('should work without spaces', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(12,15,108)'
                });
                expect(u.color).to.equal('#0c0f6c');
            });

            it('should work with spaces', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(72, 212, 89)'
                });
                expect(u.color).to.equal('#48d459');
            });

            it('should work with some spaces', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(123, 0,60)'
                });
                expect(u.color).to.equal('#7b003c');
            });

            it('should return lowercase hex with six characters', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(96, 38, 59)'
                });
                expect(u.color[0]).to.equal('#');
                expect(u.color).to.equal(u.color.toLowerCase());
                expect(u.color).to.have.lengthOf(7);
            });
        });
    });

    describe('Socket', function(){
        it('should connect', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    done();
                }
            });
        });

        it('should call send a request if shouldSend is true when the socket connects', function(done){
            var unlockStub=sinon.stub(Unlock.prototype, 'unlock').returns();
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    expect(unlockStub.called).to.equal(true);
                    Unlock.prototype.unlock.restore();
                    done();
                }
            });
            u.shouldSend=true;
        });

        it('should be marked as open', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    expect(u.isOpen()).to.equal(true);
                    done();
                }
            });
        });

        it('should call onClose when the socket closes', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    u.socket.send('close');
                },
                onClose: function(){
                    done();
                }
            });
        });
    });
});
