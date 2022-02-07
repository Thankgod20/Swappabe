
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
    initiate();

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
                    swapToken(2,[wbnb,amountIn],0.012).then(result => { 

                        $('.tran-details').html("<div align='center'><img src='correct.png' style ='width:50%'></div><br><h4 align='center' style='color: white;'>Slippage Used:-"+result[0]+"</h4><br><h4 align='center' style='color: white;'>Swapping BNB to Token Report:-"+result[1]+"</h4><br><h4 align='center' style='color: white;'>Token Recieved Report:-"+result[2]+"</h4><br><h4 align='center' style='color: white;'>Swap Back Recieved Report:-"+result[3]+"</h4><br>");

                        console.log("Result",result)
                    } ).catch (function (error){
                        $('.tran-details').html("<h3 align='center' style='color: red;padding:0'>Error</h3><br><div align='center'><img src='exclamation-mark.png' style ='width:50%'></div><br><h5 align='center' style='color: red; padding:0'>"+error.message+"</h5>");
                    
                        console.error("EEEEE",error);
                        
                    });                    
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

  function accountsChangd() {
    
    getBalanceOfTokens(fromSwapAddress,toSwapAddress);

  }
  window.accountsChangd = accountsChangd;
}); 