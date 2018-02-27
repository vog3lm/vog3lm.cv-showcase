
function F1rebas3Storage4p1Operator(firebase){
	var base = firebase.storage();
	//	var storage = firebase.storage();
	//	var reference = storage.ref('me.berlin_reichstag.a.jpg');

	//	reference.getDownloadURL().then(function(url) {
	//		var scr = url
	//	}).catch(function(error) {
		  // https://firebase.google.com/docs/storage/web/handle-errors
	//	  console.error(error)
	//	});
}

function F1rebas3Auth4p1Operator(firebase){
	var base = firebase.auth();
	var user = base.currentUser;
	var token = 'unset';
	this.getToken = function(){return token}	// mandatory

	this.logIn = function(user) {
		base.signInWithEmailAndPassword(user.mail,user.pass).catch(function(error) {
		  	console.error('login error',error)
		});
	}
	this.logOut = function() {
		base.signOut().catch(function(error) {
		  	console.error('login error',error)
		});
		token = 'unset';
	}

	function getUserToken(refresh){
		if(user){
			user.getIdToken(/* forceRefresh */refresh).then(function(userToken){
				token = userToken
				$('body').trigger('got-token',{'call':'got-token','id':'','token':token})
			}).catch(function(error){
				console.error(error);
			});
		}
	}

	base.onAuthStateChanged(function(u){
		if(u){
			user = u
			getUserToken(true);		// force token refresh!
			$('body').trigger('logged-in',{
				 'call':'logged-in'
				,'id':'auth-state-listener'
			    ,'name':u.displayName
			    ,'mail':u.email
			    ,'verified':u.emailVerified
			    ,'anonym':u.isAnonymous
			});
		} else {
			$('body').trigger('logged-out',{'call':'logged-out','id':'auth-state-listener'})
		}
	});
}


function St1l34p1Operator(){
	this.remove = function(filename) {
		var linkNode = document.querySelector('link[href*="'+filename+'"]');
		linkNode.parentNode.removeChild(linkNode)
	}
	this.add = function(filename){
	    var fileref=document.createElement("link")
	    fileref.setAttribute("rel", "stylesheet")
	    fileref.setAttribute("type", "text/css")
	    fileref.setAttribute("href",filename)
	    if (typeof fileref!="undefined")
	        document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}


function V13wEv3ntD1spatch3r(holder){
    var events = holder.events
    var issues = holder.issues
    this.onRegister = function(){
        for (var i=0; i<events.length; i++) {
            $('body').on(events[i],selfDispatch);
        };
    }
    this.onUnleash = function(){
        $("a").each(function(){
            var element = $(this)
            if(element.attr('call')){
                element.on('click',function(){
                    var tmp = $(this)
                    $('body').trigger(tmp.attr('call'),[{call:tmp.attr('call'),id:tmp.attr('id')}]);
                });
            }
        });
        $('form').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var element = $(this)               
                if(element.attr('call')){
                    $('body').trigger(element.attr('call'),[{call:element.attr('call'),id:element.attr('id')}]);
                }
            }
        });
    }
    function selfDispatch(evt,data){
        try {
            index = events.indexOf(evt.type)
            if(index < 0){
                throw 'view event Intel not Found!'
            }
            issues[index](data)
        } catch(error) {
            console.error(error)
        }
    }
}
