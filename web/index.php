<?php



if (!empty($_SESSION['GET_USER_SSID'])) {

    header('location: ../home');

    exit;

}



?>

<!DOCTYPE html>

<html lang="tr">

<head>

    <?php include 'types/header.php'; ?>

</head>

<body></body>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>

<body id="kt_body" class="auth-bg">

    <div class="d-flex flex-column flex-root">

        <div class="d-flex flex-column flex-lg-row flex-column-fluid">

            <div class="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10 justify-content-center">

                <div class="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">

                    <div class="d-flex flex-stack py-2">

                        <div class="me-2">

                        </div>

                       

                    </div>

                    <div class="py-20" id="login-form-container">

                        <form class="form w-100" novalidate="novalidate" id="kt_sign_up_form" action="#">

                            <div class="card-body">

                                <div class="text-start mb-10">

                                    <center><img src="../assets/img/logo.png" width="100"></center> <br><br>

                                    <center><h1 class="text-white mb-3 fs-3x" data-kt-translate="sign-in-title">

                                        cartel.live

                                    </h1>

                                    <div class="text-gray-700 fw-semibold fs-6" data-kt-translate="general-desc">

                                        <span id="kt_typedjs_example_1" class="fs-2 fw-bold"></span>

                                    </div></center>

                                </div>



                                <div class="fv-row mb-8">

                                    <input type="email" placeholder="Email Adresi" name="email" autocomplete="off" data-kt-translate="sign-in-input-email" class="form-control form-control-lg" />

                                </div>



                                <div class="position-relative mb-5" data-kt-password-meter="true">

                                    <input type="password" id="password" placeholder="Şifre" name="password" autocomplete="off" data-kt-translate="sign-in-input-password" class="form-control form-control-lg" />

                                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2" data-kt-password-meter-control="visibility">

                                        <i class="ki-duotone ki-eye-slash fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>

                                        <i class="ki-duotone ki-eye d-none fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>

                                    </span>

    </div>



    <div class="fv-row mb-10">

        <div class="form-check form-check-custom form-check-solid form-check-inline">

            <input class="form-check-input" type="checkbox" id="rememberMe" name="remember_me" value="1"/>



            <label class="form-check-label fw-semibold text-gray-700 fs-6" for="rememberMe">

                Beni anımsa

            </label>

        </div>

    </div>



                                <div class="d-flex flex-stack">

                                    <button id="kt_sign_up_submit" class="btn btn-lg btn-light-secondary w-100 mb-5">

                                        <span class="indicator-label" data-kt-translate="sign-in-submit">

                                            Giriş Yap

                                        </span>

                                        <span class="indicator-progress">

                Lütfen bekleyiniz... <span class="spinner-border spinner-border-sm align-middle ms-2"></span>

            </span>

                                    </button>

    </div>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    </div>

</body>

</html>









    <script src=".././assets/plugins/custom/typedjs/typedjs.bundle.js"></script>

    <script>

KTUtil.onDOMContentLoaded(function() {

var typed = new Typed("#kt_typedjs_example_1",

{

strings: ["cartelfx", "live", "hoş", "geldiniz"],

typeSpeed: 25

});

});</script>



    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script src=".././assets/plugins/global/plugins.bundle.js"></script>

    <script src=".././assets/js/scripts.bundle.js"></script>

    <script src=".././assets/js/custom/authentication/sign-in/i18n.js"></script>

    <script src=".././assets/js/custom/authentication/sign-in/general.js"></script>

    <script src=".././assets/js/custom/login.js"></script>



</body>



</html>
