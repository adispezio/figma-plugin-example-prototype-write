// Utilities to help with creating and formatting reactions
export function formatAction(str: string) {
  if (str == null) {
    return 'None'
  }
  switch (str) {
    case 'NONE':
      return 'None'
    case 'NAVIGATE_TO':
      return 'Navigate to'
    case 'OPEN_OVERLAY':
      return 'Open overlay'
    case 'SCROLL_TO':
      return 'Scroll to'
    case 'SWAP_WITH':
      return 'Swap overlay'
    case 'SWAP_STATE_TO':
      return 'Change to'
    case 'GO_BACK':
      return 'Back'
    case 'CLOSE_OVERLAY':
      return 'Close overlay'
    case 'OPEN_URL':
      return 'Open link'
    default:
      return ''
  }
}

export function formatTriggerType(str: string) {
  if (str == null) {
    return 'None'
  }
  switch (str) {
    case 'NONE':
      return 'None'
    case 'ON_CLICK':
      return 'On click'
    case 'ON_HOVER':
      return 'While hovering'
    case 'ON_PRESS':
      return 'While pressing'
    case 'DRAG':
      return 'On drag'
    case 'MOUSE_IN':
      return 'Mouse enter'
    case 'MOUSE_OUT':
      return 'Mouse leave'
    case 'MOUSE_DOWN':
      return 'Mouse down'
    case 'MOUSE_UP':
      return 'Mouse up'
    case 'AFTER_TIMEOUT':
      return 'After delay'
    case 'ON_KEY_DOWN':
      return 'Key/gamepad'
    default:
      return str
  }
}

