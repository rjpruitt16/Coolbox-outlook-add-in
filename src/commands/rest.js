const graphUrl = "https://outlook.office.com/api/v2.0/me/";
const folderDirectory = "MailFolders/Inbox/childfolders";
const folderDirectory2 = "MailFolders/Inbox/messages";

export const folderPaths = {
  "@COOLMONDAY": folderDirectory2 + "/@COOLMONDAY",
  "@COOLNOW": folderDirectory2 + "/@CoOLNOW"
};

export function callGraphApi(apiTriggerCallback, bodyParameters, options) {
  Office.onReady(() => {
    Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function(result) {
      if (result.status === "succeeded") {
        apiTriggerCallback(result.value, bodyParameters, options);
      }
    });
  });
}

export async function getMessages(accessToken, parameters, options) {
  var getMessageUrl = graphUrl + `MailFolders/${options["folderId"]}/messages`;
  var response = await fetch(getMessageUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    }
  });
  response.json().then(data => {
    options.onDataCompleteCallback(data, accessToken);
  });
}

export async function createFolder(accessToken, parameters, options) {
  var getFolderUrl = graphUrl + folderDirectory;
  const response = await fetch(getFolderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    },
    body: JSON.stringify(parameters)
  }).then(res => {
    // Message is passed in `item`.
    return res.json();
  });
  return response;
}

export async function getAllApiFolders(accessToken, parameters, options) {
  const getFoldersUrl = graphUrl + folderDirectory;
  const response = await fetch(getFoldersUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    }
  });
  response.json().then(folders => {
    options.onDataCompleteCallback(folders);
  });
}

export function cleanCoolNowFolder(data) {
  const coolNowFolder = data.value.filter(folder => folder.DisplayName === "@COOLNOW")[0];

  callGraphApi(
    getMessages,
    {},
    {
      folderId: coolNowFolder.Id,
      onDataCompleteCallback: cleanWeekdayMessages
    }
  );
}

export function cleanWeekdayMessages(messages, accessToken) {
  messages.value.forEach(message => {
    if (message.IsDraft) {
      sendMessage(accessToken, {}, { messageId: message.Id });
    } else {
      changeAndMoveMessageToInbox(
        accessToken,
        {
          SentDateTime: new Date().toISOString(),
          CreatedDateTime: new Date().toISOString(),
          ReceivedDateTime: new Date().toISOString(),
          IsRead: false
        },
        { messageId: message.Id }
      );
    }
  });
}

export async function changeAndMoveMessageToInbox(accessToken, parameters, options) {
  var getUpdateUrl = graphUrl + `messages/${options.messageId}`;
  var updateResponse = await fetch(getUpdateUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    },
    body: JSON.stringify(parameters)
  });
  await updateResponse.json();
  if (updateResponse.ok) {
    var getUpdateUrl = graphUrl + `messages/${options.messageId}/move`;
    var moveResponse = await fetch(getUpdateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + accessToken
      },
      body: JSON.stringify({
        DestinationId: "Inbox"
      })
    });
  }
  moveResponse = await moveResponse.json();
  console.log(moveResponse);
}

export async function sendMessage(accessToken, parameters, options) {
  var getMessageUrl = graphUrl + `messages/${options.messageId}/send`;
  var response = await fetch(getMessageUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + accessToken
    }
  });
  console.log(response);
}
