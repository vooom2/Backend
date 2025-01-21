const auth_mail_template = {
    reset: (data) => {
      return `<figure class="table">
            <table style="margin:0 auto;">
                <tbody>
                    <tr>
                        <td>
                            <figure class="image image_resized" style="width:18%;">
                                <img style="height:40px; width:auto" src="https://vooom-app.onrender.com/assets/logo-B5ni8Dk_.png" width="705" height="176">
                            </figure>
                        </td>
                    </tr>
                </tbody>
            </table>
        </figure>
        <figure class="table" style="width:72.28%; margin:0 auto;">
            <table class="ck-table-resized">
                <colgroup><col style="width:100%;"></colgroup>
                <tbody>
                    <tr>
                        <td>
                            <span style="background-color:rgb(255,255,255);color:rgb(0,18,51);font-family:Mulish, system-ui, -apple-system, sans-serif;font-size:16px;"><span style="-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;">
                           Dear ${data?.name}, <br/>
                              We received a request to reset your password.
                              Kindly use the button below to reset your password.
                              <br/>
                              <br/>
                              <a href="${process.env.PUBLIC_BASEURL}verify?token=${data?.otp}}" style="border-radius:8px; padding:10px 15px; color:#fff; background:#000; text-decoration:none">Reset Password</a>
                              <br/>
                              <br/>
                              If this was not you, please ignore this email.
                              <br/><br/>
                              Best regards,<br/>
                              The Vooom Team.
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </figure>`;
    },

  };
  
  module.exports = auth_mail_template;
  