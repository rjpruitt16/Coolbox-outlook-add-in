function getCreateFolderXMLRequest(request) {
  /*
  example request parameter
  <t:Folder>
    <t:DisplayName>Folder1</t:DisplayName>
  </t:Folder>
  <t:Folder>
    <t:DisplayName>Folder2</t:DisplayName>
  </t:Folder>
  */

  var completeRequest =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/ "' +
    '               xmlns:t="https://schemas.microsoft.com/exchange/services/2006/types">' +
    "      <soap:Body>" +
    '          <CreateFolder xmlns="https://schemas.microsoft.com/exchange/services/2006/messages">' +
    "              <ParentFolderId>" +
    '                  <t:DistinguishedFolderId Id="msgfolderroot"/>' +
    "              </ParentFolderId>" +
    "              <Folders>" +
    request +
    "              </Folders>" +
    "          </CreateFolder>" +
    "      </soap:Body>" +
    "</soap:Envelope>";

  return completeRequest;
}

export default function createFolders(listOfFolders, callback) {
  const folderHeader = "<t:Folder> <t:DisplayName>";
  const folderFooter = "</t:DisplayName> </t:Folder>";
  var xmlFolders = [];
  for (var folderName of listOfFolders) {
    xmlFolders.push(folderHeader + folderName + folderFooter);
  }

  const folderXMLRequest = getCreateFolderXMLRequest(xmlFolders.join(" "));

  Office.context.mailbox.makeEwsRequestAsync(folderXMLRequest, callback);
}
