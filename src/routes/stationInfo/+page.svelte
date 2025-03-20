<script>
    // No additional logic is needed for this layout.
  </script>
  
  <style>
    :root {
      --gap: 16px; /* Adjust as needed */
    }
  
    /* Reset default margins/padding to avoid unintended whitespace */
    html, body {
      margin: 0;
      padding: 0;
    }
  
    /* Main container for the component */
    .container {
      width: 100%;       /* Fill the entire viewport width */
      box-sizing: border-box;
    }
  
    /* Slots for content above and below the boxes */
    .above,
    .below {
      margin: var(--gap);
    }
  
    /* Grid container that fills the full width */
    .box-container {
      display: grid;
      /* Two equal columns that stretch to fill the space */
      grid-template-columns: 1fr 1fr;
      /* The gap between the boxes themselves */
      gap: var(--gap);
      /* This padding ensures the space from the boxes to the screen edges 
         equals the gap between columns */
      padding: 0 calc(var(--gap)/2);
  
      /* So the box-container itself takes the full width, 
         including the padding. */
      width: 100%;
      box-sizing: border-box;
    }
  
    /* Each box styling */
    .box {

      padding: 20px;

      border-radius: 10px;
        text-align: center;
        border-color: black;
        border-width: 2px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    }

  </style>
  
  <div class="container">
    <!-- Content above the boxes can be added via this slot -->
    <slot name="above" />
  
    <div class="box-container">
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 1</div>
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 2</div>
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 3</div>
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 4</div>
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 5</div>
        <div class="box" style="background-color:rgb(88, 123, 227);">Box 6</div>
      </div>
    
      <!-- Content below the boxes can be added via this slot -->
      <slot name="below" />
    </div>
  