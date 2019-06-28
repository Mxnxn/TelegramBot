const https =require('https');
var Jssoup = require('jssoup').default;
const express = require('express');
var app = express();

const teleurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates"

let json = "";
let song = "";
let singer = "";
let offset = "";
let chat_id = "";
let msgobj = "";
let comm = "" ;
// app.use('/',(req,res)=>{
//     res.writeHead(200,{'Content-Type':'text/html'});
//     res.write(`xlyrics_BOT`);
    https.get(teleurl,(resp)=>{
        let telej = "";
        
        resp.on('data',data=>{
            resp.setEncoding("utf8");
            telej += data;
        }); // GOT TELEGRAM DATA TO STRING
        
        resp.on('end',()=>{
            telej = JSON.parse(telej);  //STRING CONVERTED INTO JSON OBJECT
            try{

                msgobj = Object.keys(telej.result).length-1;  //GETTING ARRAY OF REQUESTS 3-1 = 2 {0,1,2}
                let copyobj = msgobj;   //COPYTING IT FOR DELETING REQUESTS
                
                while(msgobj >= 0){     // FOR MULTIPLE REQUEST OCCURS
                    json = telej.result[msgobj].message.text;
                    json = json.split(" ");
                    comm = json[0];
                    song = json[1];
                    singer = json[2];
                    offset = telej.result[copyobj].update_id+1;
                    chat_id = telej.result[msgobj].message.chat.id;
                    
                    if(comm === '!s')  // SEARCH COMMAND
                    {
                        const urlx = "https://api.genius.com/search?q="+song+"%20"+singer+"&access_token=4ecFpBWrxMtxKnc3WkB2B07MPoayDn4DjF0cWqQirY-nsC17vvq3LPoSAD6HDvJc"
                        https.get(urlx,(httpRes)=>{
                            let body = "";
                            let path = "";

                            httpRes.on('data',data=>{
                                httpRes.setEncoding('utf8');
                                body += data;
                            });  //GOT DATA INTO STRING FROM API AFTER SEARCH
                            
                            httpRes.on('end', () => {
                                body = JSON.parse(body);  //CONVERTING STRING INTO JSON OBJECT
                                try{
                                        path = body.response.hits[0].result.url;  //GETTING URL OF SONG FROM JSON OBJECT
                                        // console.log(`${body.response.hits[msgobj].result.url}`);
                                        console.log(`${path}`);
                                        // serverRes.writeHead(200,{'Content-Type':'text/html'});
                                        // serverRes.write(`LINK : ${path}`);
                                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                                        https.get(delurl,res=>{
                                            res.on('end',()=>{
                                                console.log("Deleted");
                                            });
                                        }); // DELETING REQUEST FROM TELEGRAM AFTER GETTING URL OF SONG

                                        https.get(path,(resp) => {
                                            let data = '';
                                            var newData = "";
                                            var artist = "";
                                            var sng = "";
                                            
                                            resp.on('data',(chunk) => {
                                                data = data +chunk;
                                            })  // GOT HTML DATA FROM SONG URL

                                            resp.on('end', () => {
                                                var soup = new Jssoup(data);  //TRAVERSING
                                                newData = soup.findAll('div','lyrics'); // DIV TAG OF LYRICS TEXT
                                                var soup = new Jssoup(newData);
                                                newData = soup.getText("%0A");  // ( " %0A " FOR NEWLINE) ITS URL ENCODED CHARACTER
                                                var ss = new Jssoup(data);
                                                sng = ss.findAll('h1','header_with_cover_art-primary_info-title');  //FOR SONG NAME
                                                var ss = new Jssoup(sng);
                                                sng = ss.getText();
                                                console.log(sng);
                                                var lol = new Jssoup(data);
                                                artist = lol.findAll('a','header_with_cover_art-primary_info-primary_artist');  // FOR ARTIST OF SONG
                                                var lol = new Jssoup(artist);
                                                artist = lol.getText();
                                                console.log(artist);
                                                var ret = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/sendMessage?chat_id="+chat_id+"&text="+sng+"-"+artist+"%0A"+"%0A"+newData;
                                                
                                                https.get(ret,(res)=>{
                                                    res.on('end',()=>{
                                                        console.log('LINK SEND');
                                                    });
                                                }) // LYRICS SEND TO TELEGRAM USER WHOM REQUESTED
                                            });

                                            }).on("error", (err) => {
                                                console.log("Error: " + err.message);
                                        });
                                        
                                        console.log('REQUEST ENDED'); 
                                }
                                catch(e)
                                {
                                    if(e instanceof TypeError){
                                        
                                        console.log('ERRRORR : '+e.stack);
                                        
                                        var ret = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/sendMessage?chat_id="+chat_id+"&text=SEARCH is not able to find song";
                                        https.get(ret,(res)=>{
                                            res.on('end',()=>{
                                                console.log('LINK SEND');
                                            });
                                        }); // IF ERROR GENERATED REQUEST SHOULD BE DELETE FROM TELEGRAM
                                        
                                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                                        https.get(delurl,res=>{
                                            console.log("Deleted");
                                        });
                                    }
                                }
                            });
                        });
                    }else if(comm === "!h"){
                        
                        var ret = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/sendMessage?chat_id="+chat_id+"&text=Assist from xLyrics%20%20:"+"%0A"+"%0A"+"Commands%20:"+"%0A"+"%0A"+"1)  %21s : for song"+"%0A"+"eg%20: %21s <song> <artist>"+"%0A"+"%0A"+"2)  !t : for Compliment "+"%0A"+"%0A"+"More are coming soon";
                        https.get(ret,(res)=>{
                            res.on('end',()=>{
                                console.log('LINK SEND');
                            });
                        
                        })      //HELP ASSIST MESSAGE FOR USER ON DEMAND OF HELP
                        
                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                        https.get(delurl,res=>{
                            console.log("Deleted");
                        }); // DELETING REQUEST FOR WRONG COMMAND

                    }else if(comm === "!t"){
                        
                        var ret = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/sendMessage?chat_id="+chat_id+"&text=It's my pleasure to Serve you!";
                        https.get(ret,(res)=>{
                            res.on('end',()=>{
                                console.log('LINK SEND');
                            });
                        
                        })      //HELP ASSIST MESSAGE FOR USER ON DEMAND OF HELP
                        
                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                        https.get(delurl,res=>{
                            console.log("Deleted");
                        }); // DELETING REQUEST FOR WRONG COMMAND

                    }else if(comm.charAt(0) == '!'){

                        var ret = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/sendMessage?chat_id="+chat_id+"&text=Opps,This command Out of my Scope!!!";
                        https.get(ret,(res)=>{
                            res.on('end',()=>{
                                console.log('LINK SEND');
                            });
                        
                        })

                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                        // console.log(delurl);
                        https.get(delurl,res=>{
                            console.log("Deleted");
                        });    // IGNORING MESSAGES AND DELETING IT FROM TELEGRAM BOT REQUEST

                    }else{
                        const delurl = "https://api.telegram.org/bot580065251:AAEGYP4PCYyk_0emgJR5eq2bCCDWb28_jsE/getUpdates?offset="+offset;
                        // console.log(delurl);
                        https.get(delurl,res=>{
                            console.log("Deleted");
                        });
                    }
                    msgobj = msgobj - 1;
                }  // END OF A REQUEST
            }catch(e){ 
                if(e instanceof TypeError){
                    console.log('ERRROR : '+e.stack);
                }
            }
        }); //processing on request
    })
// }).listen(process.env.PORT || 3001,()=>{
//     console.log("LISTENING")
// }); // end of telegram request
