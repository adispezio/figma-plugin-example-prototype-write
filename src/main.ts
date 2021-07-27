import { showUI, once, emit, getSelectedNodesOrAllNodes, formatWarningMessage, getSceneNodeById, compareObjects } from '@create-figma-plugin/utilities'

export default function () {
  let origins:any;
  let destinations:SceneNode[];

  function handleSelectionUpdate() {
    let selectionData = [];
    for(let node of figma.currentPage.selection) {
      let selectionNode = {
        'id': node.id,
        'name': node.name,
        'type': node.type
      };
      selectionData.push(selectionNode)
    }

    emit('UPDATE_SELECTION', selectionData);
  }

  function handleConfirmOrigins() {
    origins = getSelectedNodesOrAllNodes();

    figma.currentPage.selection = [];
  }

  function handleConfirmDestinations() {
    destinations = getSelectedNodesOrAllNodes();
    const reactions:{}[] = [];

    // Build the reaction set
    for (let destination of destinations) {
      if(destination.type === 'FRAME') {
        let newReaction = {
          "action": {
              "type": "NODE",
              "destinationId": destination.id,
              "navigation": "NAVIGATE",
              "transition": null,
              "preserveScrollPosition": false
          },
          "trigger": {
              "type": "ON_CLICK"
          }
        }

        reactions.push(newReaction)
      } else {
        figma.notify(formatWarningMessage("One or more destinations were not a frame!"))
      } 
    }

    for (let node of origins) {
      if(node.type === 
        "BOOLEAN_OPERATION" || 
        "COMPONENT" || 
        "COMPONENT_SET" ||
        "ELLIPSE" ||
        "FRAME" ||
        "GROUP" ||
        "INSTANCE" ||
        "LINE" ||
        "POLYGON" ||
        "RECTANGLE" ||
        "SLICE" ||
        "STAR" ||
        "TEXT" ||
        "VECTOR"
        ) {
          node.reactions = reactions;
      } else {
        figma.notify(formatWarningMessage("One or more interactions was not a valid layer!"))
      }
    }


    figma.currentPage.selection = [];

    figma.closePlugin()

  }

  figma.on("selectionchange", handleSelectionUpdate);

  once('CONFIRM_ORIGINS', handleConfirmOrigins)
  once('CONFIRM_DESTINATIONS', handleConfirmDestinations)

  const options = { width: 240, height: 200 }
  const data = { text: null }
  showUI(options, data)

  handleSelectionUpdate();
  
}