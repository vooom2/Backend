const onboarding_template = {
  owner: (data) => {
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
                            Thank you for signing up with Vooom! We’re excited to have you join us.<br/>
Log in to your Owner App to manage and track your bike statuses, and ensure smooth operations. <br/>
<br/> <br/>
If you have any questions, our support team is here to assist at <a href="mailtoo:support@vooom.com">support@vooom.com</a>. <br/>
Looking forward to a successful partnership! <br/>
<br/>
Best regards, <br/>
The Vooom Team.

                          </span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </figure>`;
  },
  rider: (data) => {
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
                            Welcome to Vooom! We’re thrilled to have you on board.<br/>
To get started, please complete your document verification in the Rider App. <br/>
If you have any questions, feel free to reach out to our support team at <a href="mailtoo:support@vooom.com">support@vooom.com</a>.
<br/>
Happy Riding! 

<br/><br/>
Best regards, <br/>
The Vooom Team.


                          </span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </figure>`;
  },

  otp:(data) =>{
    return `
    <figure class="table">
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
                         ${data?.name}, <br/>
                            Kindly use the verification code to complete your onboarding process  <b>${data?.otp}</b>.
                            <br/> 
                            <br/> 
                            Best regards,
                            The Vooom Team.

                          </span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </figure>
    `;
  }
};

module.exports = onboarding_template;
