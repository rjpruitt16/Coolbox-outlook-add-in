const graphUrl = "https://outlook.office.com/api/v2.0/me/";
export function callGraphApi(apiTriggerCallback, parameters) {
  Office.onReady(() => {
    Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function(result) {
      if (result.status === "succeeded") {
        apiTriggerCallback(result.value, parameters);
      }
    });
  });
}

export function getMessageSubject(accessToken, parameters) {
  return getCurrentItem(accessToken);
}

export async function createFolder(accessToken, parameters) {
  var getFolderUrl = graphUrl + "MailFolders/Inbox/childfolders";
  const response = await fetch(getFolderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    },
    body: JSON.stringify(parameters)
  })
    .then(res => {
      // Message is passed in `item`.
      return res.json();
    })
    .then(data => {
      console.log(data);
    });
  return response;
}

function getItemRestId() {
  if (Office.context.mailbox.diagnostics.hostName === "OutlookIOS") {
    // itemId is already REST-formatted.
    return Office.context.mailbox.item.itemId;
  } else {
    // Convert to an item ID for API v2.0.
    return Office.context.mailbox.convertToRestId(
      Office.context.mailbox.item.itemId,
      Office.MailboxEnums.RestVersion.v2_0
    );
  }
}

async function getCurrentItem(accessToken) {
  // Get the item's REST ID.
  var itemId;
  itemId = getItemRestId();

  // Construct the REST URL to the current item.
  // Details for formatting the URL can be found at
  // https://docs.microsoft.com/previous-versions/office/office-365-api/api/version-2.0/mail-rest-operations#get-messages.
  var getMessageUrl = graphUrl + "messages/" + itemId;
  const response = await fetch(getMessageUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    }
  })
    .then(res => {
      // Message is passed in `item`.
      return res.json();
    })
    .then(data => {
      console.log(data);
    });
  return response;
}
