// Launch checklist data. Generic items only: no claims about game content.
// Shape: array of sections { title, items: [{ id, text }] }. Item ids must stay stable (progress is saved by id).
var TRACKER_DATA = [
  {
    title: 'Pre-launch setup',
    items: [
      { id: 'pre-1', text: 'Check how much free storage your PS5 or Xbox Series X|S has' },
      { id: 'pre-2', text: 'Confirm your platform account is signed in and your payment details are current' },
      { id: 'pre-3', text: 'Start the download or preload as soon as it is available to you' },
      { id: 'pre-4', text: 'Charge controllers and set up a spare charging cable' },
      { id: 'pre-5', text: 'Update your PS5 or Xbox Series X|S system software' },
      { id: 'pre-6', text: 'Test your internet connection and plan for a wired link if you can' },
      { id: 'pre-7', text: 'Clear your evening and tell the people around you' },
      { id: 'pre-8', text: 'Stock water and snacks within reach of the couch or desk' }
    ]
  },
  {
    title: 'First hours',
    items: [
      { id: 'fh-1', text: 'Check the display and brightness settings before you begin' },
      { id: 'fh-2', text: 'Look through the controls and remap anything that feels wrong' },
      { id: 'fh-3', text: 'Turn on subtitles or accessibility options if they help you' },
      { id: 'fh-4', text: 'Choose your audio mix for speakers or headphones' },
      { id: 'fh-5', text: 'Make a manual save or note where you stopped after the opening session' },
      { id: 'fh-6', text: 'Take a screenshot of your favourite first moment' },
      { id: 'fh-7', text: 'Take a short break every hour' }
    ]
  },
  {
    title: 'Story progress',
    items: [
      { id: 'st-1', text: 'Finish the opening chapter' },
      { id: 'st-2', text: 'Reach the quarter point of the main story' },
      { id: 'st-3', text: 'Reach the halfway point of the main story' },
      { id: 'st-4', text: 'Reach the three-quarter point of the main story' },
      { id: 'st-5', text: 'Finish the main story' },
      { id: 'st-6', text: 'Write down your favourite mission' },
      { id: 'st-7', text: 'Watch the credits through to the end' }
    ]
  },
  {
    title: 'Side activities',
    items: [
      { id: 'sa-1', text: 'Try your first optional activity' },
      { id: 'sa-2', text: 'Spend an hour just exploring with no goal' },
      { id: 'sa-3', text: 'Find a favourite spot for screenshots' },
      { id: 'sa-4', text: 'Complete five optional activities' },
      { id: 'sa-5', text: 'Try an activity you would normally skip' },
      { id: 'sa-6', text: 'Play with a friend, if the game supports it' },
      { id: 'sa-7', text: 'Note down activities to come back to later' },
      { id: 'sa-8', text: 'Try every kind of transport you come across' }
    ]
  },
  {
    title: '100% hunt',
    items: [
      { id: 'hu-1', text: 'Open the in-game completion or stats screen and note your starting percentage' },
      { id: 'hu-2', text: 'Make a list of everything still unfinished' },
      { id: 'hu-3', text: 'Pick a collectible type and track your count' },
      { id: 'hu-4', text: 'Finish all optional missions you have found' },
      { id: 'hu-5', text: 'Check your list against a trustworthy guide for anything missed' },
      { id: 'hu-6', text: 'Keep a backup save before the last few items' },
      { id: 'hu-7', text: 'Clear the remaining items on your list' },
      { id: 'hu-8', text: 'Reach 100% on the in-game completion screen' },
      { id: 'hu-9', text: 'Record your total play time' },
      { id: 'hu-10', text: 'Share your result with friends' }
    ]
  }
];
