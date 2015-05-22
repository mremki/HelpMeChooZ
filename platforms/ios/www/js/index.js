/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    
    name : "test",
    email : "test",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

    },

    facebookconnect : function(){
        facebookConnectPlugin.login(["public_profile"],this.fb_success,this.fb_fail);
        document.location.href = "index.html";
    },

    facebookdeconnect : function(){
        facebookConnectPlugin.logout(function (response) { console.log("LOGOUT WIN: " + JSON.stringify(error)); this.fbDoLogin(); },
                                    function (response) { console.log("LOGOUT FAIL: " + JSON.stringify(error)); this.fbDoLogin(); });

        document.location.href = "index.html";
    },

    showDialog : function () { 
        facebookConnectPlugin.showDialog( { method: "feed" }, 
            function (response) { alert(JSON.stringify(response)) },
            function (response) { alert(JSON.stringify(response)) });
    },

    apiTest : function () { 
        facebookConnectPlugin.api( "me/?fields=id,email", ["user_birthday"],
            function (response) { alert(JSON.stringify(response)) },
            function (response) { alert(JSON.stringify(response)) }); 
    },

    getAccessToken : function () { 
        facebookConnectPlugin.getAccessToken( 
            function (response) { alert(JSON.stringify(response)) },
            function (response) { alert(JSON.stringify(response)) });
    },

    getStatus : function () { 
        var self = this;
        var divSeconnecter = document.getElementById("seConnecter"); 
        var divProfil = document.getElementById("profil"); 
        var divStart = document.getElementById("start"); 

        facebookConnectPlugin.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                divSeconnecter.style.display = "none";
                //get info
               facebookConnectPlugin.api("me/?fields=id,email,name", ["public_profile"],
                    function (result) {
                        self.name = result["name"];
                        self.email = result["email"];
                        console.log('data',self.name + self.email);
                        document.getElementById("identifiant").value = self.name;
                        document.getElementById("email").value = self.email;
                    },
                    function (error) {
                        alert("Failed: " + error);
                    }
                );
                divProfil.style.display = "block";
                divStart.style.display = "block";
            } else if (response.status === 'not_authorized') {
                alert("the user is logged in to Facebook, but has not authenticated your app");
                divSeconnecter.style.display = "block";
                divProfil.style.display = "none";
                divStart.style.display = "none";
            } else {
                divSeconnecter.style.display = "block";
                divProfil.style.display = "none";
                divStart.style.display = "none";
            }
        });
    },

    fb_success : function(userData){
        alert(JSON.stringify(userData));
        //
    },

    fb_fail: function(error){
        alert("Failed: " + error);
    },

    getPicture : function(){
        navigator.camera.getPicture(this.onSuccess, this.onFail, 
            { 
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }
        );
    },

    onSuccess  :  function (imageData) {
        var image = document.getElementById('myPict');
        image.src = imageData;
        return imageData;
    },    

    onFail     : function (message) {
        alert('Failed because: ' + message);
    },

    storeFirstPict : function(id){
        var pict = this.picturePicker(id);
    },

    storeSecondPict : function(id){
        var pict = this.picturePicker(id);
    },

    picturePicker :function(id){
        navigator.camera.getPicture(
          function(img){
           $('#'+id).attr('src','data:image/jpg;base64,'+img);
            
          }, function(e){
            console.log('error '+e);
          }, 
        { 
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    },
    
    showPict : function(pict1, pict2){
        
        var img_src_1  = $('#'+pict1).attr('src');
        $('#'+pict1+'_').attr('src',img_src_1);
        $('#'+pict1+'_Simulation').attr('src',img_src_1); // Juste pour la simulation coté Dist

        var img_src_2  = $('#'+pict2).attr('src');
        $('#'+pict2+'_').attr('src',img_src_2);
        $('#'+pict2+'_Simulation').attr('src',img_src_2); // Juste pour la simulation coté Dist
        
    },

    contactList  : function(){
        //alert(navigator.contacts);
        var options      = new ContactFindOptions();
        options.filter   = "";
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.nickname,navigator.contacts.fieldType.displayName,navigator.contacts.fieldType.phoneNumbers];
        var fields       = [navigator.contacts.fieldType.nickname,navigator.contacts.fieldType.displayName,  navigator.contacts.fieldType.id];
        navigator.contacts.find(fields, this.onSuccessContact, this.onErrorContact, options);
    },
    onSuccessContact : function(contacts){
         var content  = "";
         var tab_contact = '';
         var phone = '';
         for (var i = contacts.length - 1; i >= 0; i--) {
            
            if(contacts[i].phoneNumbers != null ) {
                phone = contacts[i].phoneNumbers[0].value; console.log(contacts[i].phoneNumbers[0]);
                content += '<div class="item" id="space-list-bottom">';
                content += '<div class="right floated"><input type="checkbox" class="checkbox-style" data-phone="'+phone+'"></div><div class="content"><div class="header">';
                content += contacts[i].displayName;
                content += '</div></div></div>';
                //content += '<li class="table-view-cell">'+contacts[i].displayName+' : '+phone+'<button class="btn btn-negative btn-contact" data-phone="'+phone+'">Button</button></li>';
                
            }
           
            //content += '<li class="table-view-cell">'+contacts[i].displayName+' : <button class="btn btn-negative btn-contact" data-phone="">Button</button></li>';
            
            if(i == 0){
                $('#contactList').html(content);
                
                $( '.checkbox-style' ).unbind( 'click' );
                    $('.checkbox-style').on('click',function(e){                 
                    var _phone = $(this).attr('data-phone');
                    tab_contact +=_phone+',';
                    $('#listcontact').val(tab_contact.slice(0,-1));
                });
                
                
            }
         };
         
    },
    onErrorContact : function(){
        alert('onError!');
    },

    sendSms : function(texte){
        var msg  = $('#'+texte).val();
        $('#message_Simulation').val(msg); // Juste pour la simulation coté Dist

        var contactInput = $('#listcontact').val();
        window.plugins.socialsharing.shareViaSMS (msg + ': http://www.helpmechooz.com', contactInput, this.sendOnSuccess, this.sendOnError);                                                 
    },

    sendOnError: function(msg) {
        console.log('error');
        alert('Votre message a bien été envoyé');
    },

    sendOnSuccess: function(msg) {
        alert('Votre message a bien été envoyé');
    },


    socialShare : function(){
        var contactInput = $('#listcontact').val();
        window.plugins.socialsharing.shareViaFacebook(contactInput, null, 'http://www.iesacom', this.socialOnSuccess, this.socialOnErrorContact);                                                  
    },

    socialOnSuccess: function(msg) {
        console.log('SocialSharing success: ' + msg);
    },

    socialOnErrorContact: function(msg) {
        console.log('error');
    },

    pickToShare : function(image1,image2, texte){

        var src_1  = $('#'+image1).attr('src');
        var src_2  = $('#'+image2).attr('src');
        var msg  = $('#'+texte).val();

        window.plugins.socialsharing.shareViaFacebook(msg, [src_1,src_2] , 'http://www.helpmechooz.com', this.socialOnSuccess, this.socialOnError);
                  
    },
    
    simulation : function(){
        alert('Votre choix a bien été envoyé');
    }

};

app.initialize();