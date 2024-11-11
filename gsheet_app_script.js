/**
 * Generates each member's tab with hard links for Name, Registration Number, and Postcode to the Admin tab,
 * along with the required pricing and notes section and a hyperlink to the ticket link.
 * The Purchased? checkboxes are initialized with values from the Admin tab.
 */
function regenerateMemberTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const adminSheet = ss.getSheetByName('Admin');

  // Clear all existing member tabs
  const sheets = ss.getSheets();
  protected_sheets = ['Admin', 'Welcome']
  sheets.forEach(sheet => {
    if (!protected_sheets.includes(sheet.getName())) {
      ss.deleteSheet(sheet);
    }
  });

  // Define group priorities (lower number = higher priority)
  const groupPriorities = {
    '1': {'priority': 1, 'master_cell_row': '13'},
    '2': {'priority': 1, 'master_cell_row': '14'},
    '3': {'priority': 2, 'master_cell_row': '15'},
    '4': {'priority': 2, 'master_cell_row': '16'},
    '5': {'priority': 3, 'master_cell_row': '17'},
    '6': {'priority': 3, 'master_cell_row': '18'},
    '7': {'priority': 3, 'master_cell_row': '19'},
  };

  // Define priority overrides for next most likely group
  const specialPriority = {
    "Jacob Punter": '2',
    "Sam Holt": '1',
    "Jack Lee": '1',
    "Ewan": '1'
  };

  // Get data from the Admin tab
  const data = adminSheet.getDataRange().getValues();
  const groups = {};

  // Organize data by group
  data.forEach((row, i) => {
    if (i === 0) return; // Skip header row
    const group_id = row[0];
    const name = row[1];
    const regNumber = row[2];
    const postcode = row[3];
    const purchased = row[6]; // Value of Purchased? checkbox in Admin tab
    const processing = row[7]; // Value of Purchased? checkbox in Admin tab
    const purchasedIndex = i + 1; // Row number in Admin tab for checkbox linking

    if (!groups[group_id]) groups[group_id] = [];
    groups[group_id].push({ group_id, name, regNumber, postcode, purchased, processing, purchasedIndex });
  });

  // Create a tab for each member, with their own group first and others in semi-random order
  for (const group in groups) {
    groups[group].forEach(member => {
      const sheet = ss.insertSheet(member.name);
      const header = [["Name", "Registration Number", "Postcode", "Purchased?", "Processing?"]];

      // Add member’s own group at the top with hard links
      const groupData = groups[group].map(g => [
        `=Admin!B${g.purchasedIndex}`,   // Link to Name in Admin tab
        `=Admin!C${g.purchasedIndex}`,   // Link to Registration Number in Admin tab
        `=Admin!D${g.purchasedIndex}`,   // Link to Postcode in Admin tab
        `=Admin!G${groupPriorities[g.group_id].master_cell_row}`,   // Link to Purchased? in Admin tab
        `=Admin!H${groupPriorities[g.group_id].master_cell_row}`,   // Link to Processing? in Admin tab
      ]);

      // Add other groups in semi-random order with hard links
      const otherGroups = Object.keys(groups).filter(g => g !== group);
      // const orderedOtherGroups = otherGroups.sort(() => 0.5 - Math.random());

      // Generate the list with each group appearing (4 - priority) times
      const prioritizedList = otherGroups.flatMap(g => {
        const priority = groupPriorities[g].priority;
        const repeatCount = 6 - priority;
        return Array(repeatCount).fill(g);
      });

      // Shuffle the list by sorting with a random comparator
      const shuffledList = prioritizedList.sort(() => Math.random() - 0.5);

      let orderedOtherGroups
      // Get a unique list in the order of first occurrence
      orderedOtherGroups = Array.from(new Set(shuffledList));

      if (specialPriority[member.name]) {
        // Specify the group to move to the start
        const targetGroup = specialPriority[member.name];
        // Filter out the target group from orderedOtherGroups
        const filteredList = orderedOtherGroups.filter(g => g !== targetGroup);
        orderedOtherGroups = [targetGroup, ...filteredList];
      }

      console.log(orderedOtherGroups);

      orderedOtherGroups.forEach(otherGroup => {
        const otherGroupData = groups[otherGroup].map(g => [
          `=Admin!B${g.purchasedIndex}`,   // Link to Name in Admin tab
          `=Admin!C${g.purchasedIndex}`,   // Link to Registration Number in Admin tab
          `=Admin!D${g.purchasedIndex}`,   // Link to Postcode in Admin tab
          `=Admin!G${groupPriorities[g.group_id].master_cell_row}`,   // Link to Purchased? in Admin tab
          `=Admin!H${groupPriorities[g.group_id].master_cell_row}`,   // Link to Processing? in Admin tab
        ]);
        groupData.push(...otherGroupData);
      });

      // Insert data into member tab
      sheet.getRange(1, 1, header.length, header[0].length).setValues(header);
      sheet.getRange(2, 1, groupData.length, groupData[0].length).setValues(groupData);

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#000000"); // Black background for headers
      headerRange.setFontColor("#FFFFFF");  // White font color for headers
      headerRange.setHorizontalAlignment("center");

      // Format rows by group color
      const startRow = 2;
      let currentRow = startRow;
      Object.keys(groups).forEach((grp, index) => {
        const groupSize = groups[grp].length;
        const groupRange = sheet.getRange(currentRow, 1, groupSize, 5);

        // Create the purchase? conditional formatting rule
        var purchase_rule = SpreadsheetApp.newConditionalFormatRule()
          .setRanges([groupRange]) // Specify the range
          .whenFormulaSatisfied(`=$d${currentRow}=TRUE`) // Apply the custom formula
          .setBackground('#000000') // Set a background color (optional)
          .build(); // Build the rule

        // Create the processing? conditional formatting rule
        var processing_rule = SpreadsheetApp.newConditionalFormatRule()
          .setRanges([groupRange]) // Specify the range
          .whenFormulaSatisfied(`=$e${currentRow}=TRUE`) // Apply the custom formula
          .setBackground('#a6a6a6') // Set a background color (optional)
          .build(); // Build the rule

        // Get existing rules and add the new rule
        var rules = sheet.getConditionalFormatRules();
        rules.push(purchase_rule); // Add the new rule to existing rules
        rules.push(processing_rule); // Add the new rule to existing rules
        sheet.setConditionalFormatRules(rules);

        // Apply alternating colors by group
        const color = index % 2 === 0 ? "#FFEBEE" : "#E3F2FD"; // Light red and light blue alternation
        groupRange.setBackground(color);
        groupRange.setBorder(true, true, true, true, false, false); // Adds a border around the group

        currentRow += groupSize;
      });

      // Set column widths for better readability
      sheet.setColumnWidth(1, 150);  // Name
      sheet.setColumnWidth(2, 140);  // Registration Number
      sheet.setColumnWidth(3, 100);  // Postcode
      sheet.setColumnWidth(4, 100);  // Purchased?
      sheet.setColumnWidth(5, 100);  // Purchased?

      // Add checkboxes to the "Purchased?" column and set initial values
      const purchasedRange = sheet.getRange(2, 4, groupData.length, 1);
      purchasedRange.insertCheckboxes();

      // Add checkboxes to the "Purchased?" column and set initial values
      const processingRange = sheet.getRange(2, 5, groupData.length, 1);
      processingRange.insertCheckboxes();

      // Add instructions for user
      sheet.getRange('G2').setValue("Instructions:");
      sheet.getRange('G2').setFontWeight("bold").setFontSize(12);
      sheet.getRange('G3').setValue("When you get through to the registration page, copy data from the top group down.")
      sheet.getRange('G4').setValue("If a group is greyed out, it means that someone is in the process of securing these tickets.");
      sheet.getRange('G5').setValue("If a group is blacked out, it means that group has already secured tickets.");
      sheet.getRange('G6').setValue("Please try to get tickets for the next group down and keep us updated on Zoom.");

      // Add Ticket link above the table
      sheet.getRange('G8').setValue("Ticket link");
      sheet.getRange('H8').setFormula('=HYPERLINK("https://glastonbury.seetickets.com/", "Glastonbury Festival")');
      sheet.getRange('G8:H8').setFontWeight("bold").setFontSize(12);

      // Add pricing and notes section
      const pricingData = [
        ["Item", "Price", "Notes"],
        ["London Coach", "£69.00", ""],
        ["Bath Coach", "£47.00", "Backup if London sells out"],
        ["Other coach options:", "Anywhere in South or the Midlands (e.g. Reading, Bristol, Birmingham)", ""],
        ["Ticket deposit", "£75.00", ""],
        ["", "", ""],
        ["Total cost at registration", "£864.00", ""],
        ["Cost each", "£144.00", ""],
        ["", "", ""],
        ["Deposits only cost", "£450.00", ""]
      ];
      sheet.getRange('G10:I19').setValues(pricingData);

      // Format pricing and notes section
      sheet.getRange('G9:I10').setFontWeight("bold");  // Bold header
      sheet.getRange('G10:I19').setBorder(true, true, true, true, true, true);  // Border around pricing table
      sheet.getRange('G10:G19').setFontWeight("bold"); // Bold for Item names
      sheet.setColumnWidth(7, 160);  // Set column width for "Item"
      sheet.setColumnWidth(8, 80);   // Set column width for "Price"
      sheet.setColumnWidth(9, 450);  // Set column width for "Notes"
    });
  }
}
