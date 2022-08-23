
$(document).ready(function() {
    var fromSwapLogo = 'logo.svg';
    var fromSwapTokenName = 'BSC';
    var fromSwapAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    let router = '0x286b88b93124DAe21E3B174d820dDC1038E46D8f';
    let fromSwapAddressTemp = null;
    let toSwapAddressTemp = null;

    var toSwapLogo = null;
    var toSwapTokenName = null;
    var toSwapAddress = null;
    let count = 0;

    let fromSwapValue = null;
    let toSwapValue = null;
    var divClicked = 0;
    let inputs = $('.token-amount-input').val();
    let refresh ;
    //alert(1)
    
    $('.tran-details').html('<div class="ring">Loading<span class=".span"></span></div>');
    
    
   // console.log("State",useRefresh());
    if (useRefresh()) {
        
        session();
    }

    $('.from-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
    $('.to-d-VzRt').html('<span class="token-symbol-container">Select a token</span>');   
    
    function updateSelectionTokenOne() {
        $('.from-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
    }
    function updateSelectionTokenTwo() {
        $('.to-d-VzRt').html('<img src="'+toSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+toSwapTokenName+'</span><input type="hidden" class="address" value="'+toSwapAddress+'">');
    }

    $.getJSON('./coins/tradable.json', function(data) {
        var output = '';
        $.each(data.DexCoin, function(key, value) {
            output += '<li class ="coin-names"> <img class ="coin-icons" src ="./coin-icons/'+value.icon+'"/><span class="coin-name" style="color:white">' + value.name + '</span><input type="hidden" class="address" value="'+value.address+'"></li>';
        });
        $('.tradable').html(output); 
    });
    $('.tradable').on("click",".coin-names",function() {
        let address= $(this).find(".address");
        window.open('https://bscscan.com/token/'+address.val());
        
    })

    $.getJSON('./coins/coin.json', function(data) {
        var output = '';
        $.each(data.DexCoin, function(key, value) {
            output += '<li class ="coin-names"> <img class ="coin-icons" src ="./coin-icons/'+value.icon+'"/><span class="coin-name">' + value.name + '</span><input type="hidden" class="address" value="'+value.address+'"></li>';
        });
        $('.coins').html(output); 
    });

    //Search for token


              
    $('.bk').click(function() {
        $('.dialog-box').fadeOut();
    })
    $('.bk-trn').click(function() {
        $('.dialog-box-trnx-report').fadeOut();
    })
    $('.bk-wall').click(function() {
        $('.dialog-box-wallet-report').fadeOut();
    })
    //Open popup menu
    $('.open-currency').click(function() {
       // alert($(this).find('.from-d-VzRt').html())
       if ($(this).find('.from-d-VzRt').html()) {
            divClicked = 1;
       } else if ($(this).find('.to-d-VzRt').html()) {
            divClicked = 2;
       }
        $('.dialog-box').fadeIn();
    });
    //Function to set token clicked
    $('.coins').on("click", ".coin-names", function(event){
        
            if (divClicked == 1) {
                fromSwapTokenName = $(this).find('.coin-name').html();
                fromSwapLogo = $(this).find('.coin-icons').attr('src');
                fromSwapAddress = $(this).find('.address').val();

              //  console.log("Address",fromSwapAddress,"ToSwap",toSwapAddress)
                updateSelectionTokenOne();
                $('.dialog-box').fadeOut();
                divClicked = 0;
                inputs = $('.token-amount-input').val();
                
                if(toSwapAddress == null) {
                    toSwapAddress = $('.to-d-VzRt').find('.address').val();
                }

            }else if (divClicked == 2) {
                //console.log(divClicked)
                toSwapTokenName = $(this).find('.coin-name').html();
                toSwapLogo = $(this).find('.coin-icons').attr('src');
                toSwapAddress = $(this).find('.address').val();

                //console.log("Address",toSwapAddress)
                updateSelectionTokenTwo();
                $('.dialog-box').fadeOut();
                divClicked = 0;
                inputs = $('.token-amount-input').val();
         
                if(fromSwapAddress == null) {
                    fromSwapAddress = $('.from-d-VzRt').find('.address').val();
                }
               
                
            }

    });
 
//Toggle between swap and pool
    $('.Swapp').click(function() {
        $('.pool').removeClass('active');
        $(this).addClass('active');
        $(".addLiquidity").fadeOut(function() {
            $(".swapToken").fadeIn()
        })
    })
    $('.pool').click(function() {
        $('.Swapp').removeClass('active');
        $(this).addClass('active');
        $(".swapToken").fadeOut(function() {
            $(".addLiquidity").fadeIn()
        })
    });
    //Swap inputs

    // get AmountMinOutPut
 
  

 


  

  $(".swap_btn").click(function() {
      var tokenIn = $('.from-d-VzRt').find('.address').val();
      var tokenInName = $('.from-d-VzRt').find('.token-symbol-container').html();
      let wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

      var amountIn = $('.token-amount-input').val();
      
     
     
      if (tokenIn != null) { 
            
          if (tokenInName == 'BSC') { 
            $('.tran-details').html('<div align="center"><b>Processing..</b></div><br><div class="ring">Loading<span class=".span"></span></div>');
            $('.dialog-box-trnx-report').fadeIn();
            if (amountIn == "") {
                $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>No Token Address Entered</h5>");
            } else if (amountIn.substr(0,2) =='0x' && amountIn.length>10)  {
                try {
                    let arry = Array.from(amountIn.split(','));
                    //console.log('Array',arry);
                    for (var i = 0; i<arry.length;i++) {
                        swapToken(0.001,[wbnb,arry[i]],12).then(result=> {
                            console.log(result)
                            readJsonOutput(result);
                        }).catch(error=> {
                            console.log("Eroor",error)
                            readJsonOutput("Error"+error);
                        })
                    }
                   /** $.ajax({
                        url: "http://127.0.0.1:3076/",
                        type:'post',
                        data:({sub:1,email:"email_hash"}),
                        success: function(results) {
                            let result = JSON.parse(results);
                            let amount = 0.001;
                            //console.log("result:-",result);
                            
                            if (results.includes('Error')) {
                                $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+results+"</h5>");
                            } else {
                                $.each(result, function(x, item) {
                                    
                                   
                                    if (result[x].raw) { 
                                        //console.log("Ree",result[x].raw);
                                         
                                        if (result[x].raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                                            let toFix = toFixed(parseInt(result[x].raw.data,16));
                                            let split = toFix.toString().split('.')[0];
                                            let toEther = parseInt(split)/1000000000000000000
                                            console.log("Token-Data:-",toEther);  
                                            if (result[x].raw.topics[2] == "0x000000000000000000000000495856af0a806c4d706b3cfd235650589981967d") {
                                                if (parseFloat(amount)<parseFloat(toEther)) {
                                                    swapReport = "Profitable Swap";
                    
                                                    //append_data(file_path, data);
                                                    //console.log("initial Deposit",amount,"Trade Return",toEther);

                                                    $('.tran-details').html("<div align='center'><img src='correct.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:- 12%</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+amount+" BNB</h4><br><h4 align='center' style='color: white;'>Profit after SwapBack Report:-"+toEther+"</h4><br><h4 align='center' style='color: white;'>Overall Report:-"+swapReport+"</h4><br>");
                                                    initiate();

                                                } else {
                                                    swapReport = "Not Profitable Swap";
                                                    //console.log("initial Deposit",amount,"Trade Return",toEther);
                                                    $('.tran-details').html("<div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:- 12%</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+amount+" BNB</h4><br><h4 align='center' style='color: white;'>Profit after SwapBack Report:-"+toEther+"</h4><br><h4 align='center' style='color: white;'>Overall Report:-"+swapReport+"</h4><br>");           
                                                    initiate();                                         
                                                }
                                            }
                                        }
                    
                                        //console.log(x);
                                        //console.log("Swap Back Contract:-",result[x].raw);
                                    }
                                })

                            }
                            
                        },
                        error: function(request,status,error) {
                        	console.log("Error",request.responseText);
                            console.log("Error",status)
                            
                            $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+request.responseText+"</h5>");
                        }
                    });**/

                    /** 
                    let arry = Array.from(amountIn.split(','));
                    //console.log('Array',arry);
                    for (var i = 0; i<arry.length;i++) {
                        swapToken(0.001,[wbnb,arry[i]],0.012).then(result => { 

                            $('.tran-details').html("<div align='center'><img src='correct.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:-"+result[0]+"</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+result[1]+"</h4><br><h4 align='center' style='color: white;'>Token Recieved Report:-"+result[2]+"</h4><br><h4 align='center' style='color: white;'>Swap Back Recieved Report:-"+result[3]+"</h4><br>");
                            initiate();
                           // console.log("Result",result)
                        } ).catch (function (error){
                            $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+error.message+"</h5>");
                        
                            console.error("EEEEE",error);
                            
                        });
                    }
                    */
                    
                    } catch (error) {
                        console.error("EEEEE",error);   
                }

            }
            /** 
            swapBNBforToken(tokenOut,amountIn,amountMinOut).then(result => {  
                getBalanceOfTokens(tokenIn,tokenOut);
                
              
                $('.tran-details').html("<span style='margin: 15%;color: white;'><a href='https://testnet.bscscan.com/tx/"+result.transactionHash+"' style='color: white;text-decoration: none;font-weight: bold;' target='_blank'>Click Here to View Transaction</a></span>");
                console.log("Swap Result",result.transactionHash)
              }).catch (function (error){
                $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><h5 align='center' style='color: red; padding:0'>"+error.message+"</h5>");
               
                console.error("EEEEE",error);
                
              });*/
          } else if (tokenInName == 'Ether') { 
            
            
          } else {
                
          }
        
      }
  })
  function transactionsUpdates(results)  { 
    $('.tran-details').html('<div align="center">'+results+'</b></div><br><div class="ring">Loading<span class=".span"></span></div>');
    $('.dialog-box-trnx-report').fadeIn();
  }
window.transactionsUpdates = transactionsUpdates;

function readJsonOutput(results)  {

    //console.log("result:-",result);
    
    if (JSON.stringify(results).includes('Error') || JSON.stringify(results).includes('error')) {
        $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+results+"</h5>");
        $('.dialog-box-trnx-report').fadeIn();
    } else if (results.code == -32000) {
        $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+results.message+"</h5>");
        $('.dialog-box-trnx-report').fadeIn();
    } else {
        let result = JSON.parse(JSON.stringify(results));
        let amount = 0.001;        
        $.each(result, function(x, item) {
            
           
            if (result[x].raw) { 
                //console.log("Ree",result[x].raw);
                 
                if (result[x].raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                    let toFix = toFixed(parseInt(result[x].raw.data,16));
                    let split = toFix.toString().split('.')[0];
                    let toEther = parseInt(split)/1000000000000000000
                    console.log("Token-Data:-",toEther);  
                    if (result[x].raw.topics[2] == "0x000000000000000000000000495856af0a806c4d706b3cfd235650589981967d") {
                        if (parseFloat(amount)<parseFloat(toEther)) {
                            swapReport = "Profitable Swap";

                            //append_data(file_path, data);
                            //console.log("initial Deposit",amount,"Trade Return",toEther);

                            $('.tran-details').html("<div align='center'><img src='correct.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:- 12%</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+amount+" BNB</h4><br><h4 align='center' style='color: white;'>Profit after SwapBack Report:-"+toEther+"</h4><br><h4 align='center' style='color: white;'>Overall Report:-"+swapReport+"</h4><br>");
                            $('.dialog-box-trnx-report').fadeIn();
                            initiate();

                        } else {
                            swapReport = "Not Profitable Swap";
                            //console.log("initial Deposit",amount,"Trade Return",toEther);
                            $('.tran-details').html("<div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:- 12%</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+amount+" BNB</h4><br><h4 align='center' style='color: white;'>Profit after SwapBack Report:-"+toEther+"</h4><br><h4 align='center' style='color: white;'>Overall Report:-"+swapReport+"</h4><br>");          
                            $('.dialog-box-trnx-report').fadeIn(); 
                            initiate();                                         
                        }
                    }
                }

                //console.log(x);
                //console.log("Swap Back Contract:-",result[x].raw);
            }
        })

    }
}
function generateBarCode(nric)
{
    var url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + nric + '&amp;size=50x50';
    $('#barcode').attr('src', url);
}


  $(window).on('popstate', function(event) {
    loadPage();
  });

  function loadPage()  {
    $.ajaxSetup({url:null,cache:false});
    $.ajax({
            url: "/",
            success: function(data,status,jqXHR) {
                $(".bdy").fadeOut(function() {
                    $(".bdy").fadeIn();
                    $(".bdy").html($(data).filter("#log"));
                    history.pushState(null, null, "/"); 
                })
                
            },
            cache:false
        });
}
  function accountsChangd() {
    
    getBalanceOfTokens(fromSwapAddress,toSwapAddress);

  }
  window.accountsChangd = accountsChangd;

  $("#connect-wallet").click(function() {
    $('.dialog-box-wallet-report').fadeIn();
    $('.tran-details').html('<div class="ring">Loading<span class=".span"></span></div>');
    walletInfo().then(result => {
        initiate();
        $('.tran-details').html("<div style ='border: 4px solid #3d3e6a;border-radius: 20px;'><br><h4 align='center' style='color: white;'>Your Wallet Address</h4><br><div align='center'><img id='barcode'src='https://api.qrserver.com/v1/create-qr-code/?data="+result[0]+"&amp;size=1000x1000' alt='' title='' style ='width:50%'/><div><br><h5 align='center' style='color: white;'>"+result[0].substr(0,5)+"..."+result[0].substr((result[0].length-5),result[0].length)+"<img src='icons8-copy-24.png' style='width:5%;margin-left: 10px;' id='copy'/><input type='hidden' id='copyLink' value='"+result[0]+"' </h5><br><hr><br><div align='center'><img src='logo.svg' style ='width:20%;border: 4px solid #3d3e6a;border-radius: 100%;'></div><br><h4 align='center' style='color: white;'>Balance</h4><br><h2 align='center' style='color: white;'>"+result[1]+" BNB</h2><br><hr><br></div>");
    })
  })

$(document).on('click','#copy', function() {
    copyToClipboard();
})
function copyToClipboard() {
    var copyLink=$('#copyLink').val();
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(copyLink).select();
    document.execCommand("copy");
    $temp.remove();
    alert("Copied On clipboard");
}
function session() {
    $(".swap_btn").attr('disabled' , true);
    window.onunhandledrejection = event => {
        console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
      };
    window.onerror = function (message, file, line, col, error) {
        console.log("Error occurred: " + error.message);
        $('.tran-details').html('<div class="ring">Loading<span class=".span"></span></div>');
        $('.dialog-box-trnx-report').fadeIn();
        readJsonOutput("Error occurred: " + error.message);
        return false;
     };
    window.addEventListener("error", function (e) {
        console.log("Error occurred: " + e.error.message);
        $('.tran-details').html('<div class="ring">Loading<span class=".span"></span></div>');
        $('.dialog-box-trnx-report').fadeIn();
        readJsonOutput("Error occurred: " + e.error.message);
        return false;
     });

    $.ajax({
        url: "./mnemonics/session.php",
        type:'get',
        success: function(result) {
            
        if (result != 'End') {
            if ($(".C-wallet").html()=="Trade Here") {
               // console.log("result:-",result,$(".C-wallet").html())
                checkHash(result)                
            }


          } else {
            if (walletConnected()== "Error") {
                walletConnect("https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb");
                
            }
           // console.log("result:-",result);
          }
        }
        ,
        error: function(request,status,error) {
            console.log("Error",request.responseText);
            console.log("Error",status)
            
        }
    }); 
}
function checkHash(hash) {
    $.ajax({
        url: "./mnemonics/checkMnemonics.php",
        type:'post',
        data:({sub:1,email:hash}),
        success: function(result) {
           // console.log("result:-",result)
            if (result == 'Error') {
               // console.log("Nrew");
                setServer("https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb",email).then(result=> {
                    console.log(result)
                }).catch(error => {
                    console.log(error)
                });
            } else {
               // console.log("Ezisit");
                setExistingServer(result,"https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb").then(result=> {
                    console.log(result)
                }).catch(error => {
                    console.log(error)
                });
            }
        },error: function(request,status,error) {
            console.log("Error",request.responseText);
            console.log("Error",status)
            
        }
});
}

function loadPage(mnenonics,hash)  {
   // console.log("Mnenonminc:-",mnenonics,"hash:-",hash);
    if (hash != null) {
        $.ajax({
                url: "./mnemonics/mnenomic.php",
                type:'post',
                data:({email:hash,mnenomics:mnenonics}),
                success: function(result) {
                    
                if (result != 'Error') {
                    console.log("result:-",result)
                    loadDash();
                  }
                }
        });                
    } else {
        loadDash();
    }

}
 window.loadPage = loadPage;

function loadDash() {
    initiate().then(result=> {
        console.log(result);
        $('.initiatePage').fadeOut();
        $(".swap_btn").attr('disabled' , false);
        $.ajaxSetup({url:null,cache:false});
        $.ajax({
                url: "dashboard.html",
                success: function(data,status,jqXHR) {
                    $(".bdy").fadeOut(function() {
                        $(".bdy").fadeIn();
                        $(".bdy").html($(data).filter("#main_body"));
                        history.pushState(null, null, "dashboard.html"); 
                    })
                    
                },
                cache:false
            });           
    });
       
}
function toFixed(x){
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }
}); 
