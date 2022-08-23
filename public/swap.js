
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
    //wallettConnect();
    //initiate();
    

    function wallettConnect() {
        if (walletConnected()== "Error") {
            walletConnect();
            
        }
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

                console.log("Address",fromSwapAddress,"ToSwap",toSwapAddress)
                updateSelectionTokenOne();
                $('.dialog-box').fadeOut();
                divClicked = 0;
                inputs = $('.token-amount-input').val();
                
                if(toSwapAddress == null) {
                    toSwapAddress = $('.to-d-VzRt').find('.address').val();
                }

            }else if (divClicked == 2) {
                console.log(divClicked)
                toSwapTokenName = $(this).find('.coin-name').html();
                toSwapLogo = $(this).find('.coin-icons').attr('src');
                toSwapAddress = $(this).find('.address').val();

                console.log("Address",toSwapAddress)
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
            $('.tran-details').html('');
            $('.dialog-box-trnx-report').fadeIn();
            if (amountIn == "") {
                $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>No Token Address Entered</h5>");
            } else if (amountIn.substr(0,2) =='0x' && amountIn.length>10)  {
                try {
                    $.ajax({
                        url: "http://127.0.0.1:3076/",
                        type:'post',
                        data:({sub:1,email:"email_hash"}),
                        success: function(result) {
                            console.log("result:-",result)
                            
                        },
                        error: function(request,status,error) {
                        	console.log("Error",request.responseText);
                        	console.log("Error",status)
                        }
                });
                    /** 
                    init_Swap([wbnb,amountIn],0.001,provider).then(result => { 

                        $('.tran-details').html("<div align='center'><img src='correct.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:-"+result[0]+"</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+result[1]+"</h4><br><h4 align='center' style='color: white;'>Token Recieved Report:-"+result[2]+"</h4><br><h4 align='center' style='color: white;'>Swap Back Recieved Report:-"+result[3]+"</h4><br>");

                        console.log("Result",result)
                    } ).catch (function (error){
                        $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+error.message+"</h5>");
                    
                        console.error("EEEEE",error);
                        
                    });    
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
    $('.tran-details').html('');
    walletInfo().then(result => {
        $('.tran-details').html("<div style ='border: 4px solid #3d3e6a;border-radius: 20px;'><br><h4 align='center' style='color: white;'>Your Wallet Address</h4><br><div align='center'><img id='barcode'src='https://api.qrserver.com/v1/create-qr-code/?data="+result[0]+"&amp;size=1000x1000' alt='' title='' style ='width:50%'/><div><br><h5 align='center' style='color: white;'>"+result[0].substr(0,5)+"..."+result[0].substr((result[0].length-5),result[0].length)+"</h5><br><hr><br><div align='center'><img src='logo.svg' style ='width:20%;border: 4px solid #3d3e6a;border-radius: 100%;'></div><br><h4 align='center' style='color: white;'>Balance</h4><br><h2 align='center' style='color: white;'>"+result[1]+" BNB</h2><br><hr><br></div>");
    })
  })

  function loadPage(mnenonics,hash)  {
    console.log("Mnenonminc:-",mnenonics,"hash:-",hash);
    initiate();
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
}
 window.loadPage = loadPage;

  
}); 
