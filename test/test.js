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
            new Unlock({
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
            expect(u.isOpen()).to.equal(false);
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

        it('should be marked as closed after the socket closes', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    expect(u.isOpen()).to.equal(true);
                    u.socket.send('close');
                },
                onClose: function(){
                    expect(u.isOpen()).to.equal(false);
                    done();
                }
            });
        });

        it('should delete the socket instance after it closes', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                onOpen: function(){
                    u.socket.send('close');
                },
                onClose: function(){
                    expect(u.socket).to.be.undefined;
                    done();
                }
            });
        });

        it('should call onMessage when the socket receives data', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){
                    done();
                },
                onOpen: function(){
                    u.socket.send('data');
                }
            });
        });

        it('should call onMessage with an object if the response is JSON', function(done){
            var toSend={
                a: 1,
                b: 'b',
                c: {
                    d: true
                }
            };
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(data){
                    expect(data).to.be.an('object');
                    expect(data).to.deep.equal(toSend);
                    done();
                },
                onOpen: function(){
                    u.socket.send(JSON.stringify(toSend));
                }
            });
        });

        it('should call onMessage with a number', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(data){
                    expect(data).to.be.a('number');
                    expect(data).to.equal(10);
                    done();
                },
                onOpen: function(){
                    u.socket.send(10);
                }
            });
        });

        it('should call onMessage with a string', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(data){
                    expect(data).to.be.a('string');
                    expect(data).to.equal('hello');
                    done();
                },
                onOpen: function(){
                    u.socket.send('hello');
                }
            });
        });

        it('should call onMessage with a boolean', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(data){
                    expect(data).to.be.a('boolean');
                    expect(data).to.equal(false);
                    done();
                },
                onOpen: function(){
                    u.socket.send(false);
                }
            });
        });

        it('should call onMessage with null', function(done){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(data){
                    expect(data).to.be.null;
                    done();
                },
                onOpen: function(){
                    u.socket.send(null);
                }
            });
        });
    });

    describe('Unlock button', function(){
        it('should set the button id', function(){
            var u=new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){}
            });
            expect(u.buttonId).to.equal('unlock-button');
        });

        it('should call _buildbutton', function(){
            var buttonSpy=sinon.spy(Unlock.prototype, '_buildButton');
            new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){}
            });
            expect(buttonSpy.called).to.equal(true);
            Unlock.prototype._buildButton.restore();
        });

        it('should insert button html into page', function(){
            new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){}
            });
            expect($('#unlock-logo').length).to.equal(1);
            expect($('#unlock-cover').length).to.equal(1);
            expect($('#unlock-spinner').length).to.equal(1);
        });

        it('should set the color of the button to blue by default', function(){
            new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){}
            });
            expect($('#unlock-button').css('background-color')).to.equal('rgb(47, 129, 198)');
        });

        it('should be able to specify a color for the button', function(){
            new Unlock({
                url: 'ws://localhost:3456',
                email: 'email',
                onMessage: function(){},
                color: 'rgb(128, 30, 29)'
            });
            expect($('#unlock-button').css('background-color')).to.equal('rgb(128, 30, 29)');
        });

        describe('enableButton()', function(){
            it('should do nothing if button is false', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    button: false
                });
                var docSpy=sinon.spy(document, 'getElementById');
                u.enableButton();
                expect(docSpy.called).to.equal(false);
                document.getElementById.restore();
            });

            it('should give the button the class "unlock-enabled" and remove class "unlock-disabled"', function(){
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){}
                });
                u.enableButton();
                var button=$('#unlock-button');
                expect(button.hasClass('unlock-enabled')).to.equal(true);
                expect(button.hasClass('unlock-diabled')).to.equal(false);
            });

            it('should add a click listener to call _submit', function(done){
                var submitStub=sinon.stub(Unlock.prototype, '_submit');
                var u=new Unlock({
                    url: 'ws://localhost:3456',
                    email: 'email',
                    onMessage: function(){},
                    onOpen: function(){
                        $('#unlock-button').click();
                        expect(submitStub.called).to.equal(true);
                        Unlock.prototype._submit.restore();
                        done();
                    }
                });
                u.enableButton();
            });

            it('should only add one click listener if called multiple times', function(){});

            it('should set shouldSend to true if the socket isn\'t open yet', function(){});
        });
    });
});
