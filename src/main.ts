// Import Create Figma Plugin Utilities
import { showUI, once, emit, getSelectedNodesOrAllNodes, formatWarningMessage } from '@create-figma-plugin/utilities'


export default function () {
  // Nodes that will get new reactions  
  let origins: any;

  // Destination nodes for each new reaction
  let destinations: SceneNode[];

  // Grab the required data from each node in the current selection
  // Used for both selecting the origins and the destinations
  // TODO: Add a validation function here for better error handling UX 
  function handleSelectionUpdate() {
    let selectionData = [];
    for (let node of figma.currentPage.selection) {
      let selectionNode = {
        'id': node.id,
        'name': node.name,
        'type': node.type
      };
      selectionData.push(selectionNode)
    }

    // Send the selection data to the UI
    emit('UPDATE_SELECTION', selectionData);
  }


  // Once the user confirms the origins ("layers")
  // TODO: Possibly move the "state" data into main
  function handleConfirmOrigins() {

    // Store the origins
    origins = getSelectedNodesOrAllNodes();

    // Clear the selection
    figma.currentPage.selection = [];
  }

  
  // Once destinations are confirmed, 
  function handleConfirmDestinations() {

    // Store the destinations
    destinations = getSelectedNodesOrAllNodes();
    const reactions: {}[] = [];

    // Loop over the destinations to build the reactions array
    for (let destination of destinations) {

      // For click actions, destinations must be frames
      // TODO: Support OVERLAY, BACK, and NAVIGATE_TO
      if (destination.type === 'FRAME') {

        // Build the basic click action and set the correct des
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
        // A VERY basic catch all for invalid reactions
        // TODO: Make better :D
        figma.notify(formatWarningMessage("One or more destinations were not a frame!"))
      }
    }

    // Loop over each origin node and add the reaction
    for (let node of origins) {

      // Validate that the origin can have reactions
      // TODO: Move this to handleSelectionUpdate()
      // TODO: Test for NOT Document or Page, and for a frame ancestor
      if (node.type ===
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
        // A VERY basic catch all for invalid origins
        // TODO: Make better :D
        figma.notify(formatWarningMessage("One or more interactions was not a valid layer!"))
      }
    }

    // Clear the selection
    figma.currentPage.selection = [];

    // We're done here!
    figma.closePlugin()
  }

  // 
  figma.on("selectionchange", handleSelectionUpdate);

  // Listen for the next steps in the UI
  once('CONFIRM_ORIGINS', handleConfirmOrigins)
  once('CONFIRM_DESTINATIONS', handleConfirmDestinations)

  // Show the UI
  const options = { width: 240, height: 200 }
  const data = { text: null }
  showUI(options, data)

  // Do an initial check of the current selection when the plugin loads
  handleSelectionUpdate();

}