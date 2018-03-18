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
                url: 'ws://localhost',
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if no onMessage function is given', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
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
                url: 'ws://localhost',
                email: true,
                onMessage: function(){}
            })).to.throw();
        });

        it('should fail if onMessage is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: 'onMessage'
            })).to.throw();
        });

        it('should fail if button is passed and is not a boolean', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: function(){},
                button: 'false'
            })).to.throw();
        });

        it('should fail if color is passed and is not a string', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: function(){},
                color: 0x2311f6
            })).to.throw();
        });

        it('should fail if onOpen is passed and is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: function(){},
                onOpen: 'open'
            })).to.throw();
        });

        it('should fail if onClose is passed and is not a function', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: function(){},
                onClose: false
            })).to.throw();
        });

        it('should fail if an unknown option is passed', function(){
            expect(Unlock.bind(undefined, {
                url: 'ws://localhost',
                email: 'email',
                onMessage: function(){},
                badOption: true
            })).to.throw();
        });

        describe('Color validation', function(){
            it ('should fail if color is not a valid hex number', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost',
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
                        url: 'ws://localhost',
                        email: 'email',
                        onMessage: function(){},
                        color: color
                    })).to.throw();
                }
            });

            it('should fail if given an rgba color', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgba(225, 86, 9, 0.5)'
                })).to.throw();
            });

            it('should fail if given an rgb color with values out of range', function(){
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(-4, 16, 55)'
                })).to.throw();
                expect(Unlock.bind(undefined, {
                    url: 'ws://localhost',
                    email: 'email',
                    onMessage: function(){},
                    color: 'rgb(109, 76, 743)'
                })).to.throw();
            });
        });
    });
});
