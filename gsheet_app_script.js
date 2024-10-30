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
  sheets.forEach(sheet => {
    if (sheet.getName() !== 'Admin') {
      ss.deleteSheet(sheet);
    }
  });

  // Get data from the Admin tab
  const data = adminSheet.getDataRange().getValues();
  const groups = {};

  // Organize data by group
  data.forEach((row, i) => {
    if (i === 0) return; // Skip header row
    const group = row[0];
    const name = row[1];
    const regNumber = row[2];
    const postcode = row[3];
    const purchased = row[6]; // Value of Purchased? checkbox in Admin tab
    const purchasedIndex = i + 1; // Row number in Admin tab for checkbox linking

    if (!groups[group]) groups[group] = [];
    groups[group].push({ name, regNumber, postcode, purchased, purchasedIndex });
  });

  // Create a tab for each member, with their own group first and others in semi-random order
  for (const group in groups) {
    groups[group].forEach(member => {
      const sheet = ss.insertSheet(member.name);
      const header = [["Name", "Registration Number", "Postcode", "Purchased?"]];

      // Add member’s own group at the top with hard links
      const groupData = groups[group].map(g => [
        `=Admin!B${g.purchasedIndex}`,   // Link to Name in Admin tab
        `=Admin!C${g.purchasedIndex}`,   // Link to Registration Number in Admin tab
        `=Admin!D${g.purchasedIndex}`,   // Link to Postcode in Admin tab
        g.purchased  // Initial value for checkbox
      ]);

      // Add other groups in semi-random order with hard links
      const otherGroups = Object.keys(groups).filter(g => g !== group);
      const orderedOtherGroups = otherGroups.sort(() => 0.5 - Math.random());

      orderedOtherGroups.forEach(otherGroup => {
        const otherGroupData = groups[otherGroup].map(g => [
          `=Admin!B${g.purchasedIndex}`,   // Link to Name in Admin tab
          `=Admin!C${g.purchasedIndex}`,   // Link to Registration Number in Admin tab
          `=Admin!D${g.purchasedIndex}`,   // Link to Postcode in Admin tab
          g.purchased  // Initial value for checkbox
        ]);
        groupData.push(...otherGroupData);
      });

      // Insert data into member tab
      sheet.getRange(1, 1, header.length, header[0].length).setValues(header);
      sheet.getRange(2, 1, groupData.length, groupData[0].length).setValues(groupData);

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 4);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#000000"); // Black background for headers
      headerRange.setFontColor("#FFFFFF");  // White font color for headers
      headerRange.setHorizontalAlignment("center");

      // Format rows by group color
      const startRow = 2;
      let currentRow = startRow;
      Object.keys(groups).forEach((grp, index) => {
        const groupSize = groups[grp].length;
        const groupRange = sheet.getRange(currentRow, 1, groupSize, 4);

        // Apply alternating colors by group
        const color = index % 2 === 0 ? "#FFEBEE" : "#E3F2FD"; // Light red and light blue alternation
        groupRange.setBackground(color);
        groupRange.setBorder(true, true, true, true, false, false); // Adds a border around the group

        currentRow += groupSize;
      });

      // Set column widths for better readability
      sheet.setColumnWidth(1, 150);  // Name
      sheet.setColumnWidth(2, 120);  // Registration Number
      sheet.setColumnWidth(3, 100);  // Postcode
      sheet.setColumnWidth(4, 100);  // Purchased?

      // Add checkboxes to the "Purchased?" column and set initial values
      const purchasedRange = sheet.getRange(2, 4, groupData.length, 1);
      purchasedRange.insertCheckboxes();

      // Set initial checkbox values based on Admin tab
      groupData.forEach((row, index) => {
        purchasedRange.getCell(index + 1, 1).setValue(row[3]); // row[3] contains the initial checkbox value from Admin
      });

      // Add Ticket link above the table
      sheet.getRange('F1').setValue("Ticket link");
      sheet.getRange('G1').setFormula('=HYPERLINK("https://glastonbury.seetickets.com/", "Glastonbury Festival")');
      sheet.getRange('F1:G1').setFontWeight("bold").setFontSize(12);

      // Add pricing and notes section
      const pricingData = [
        ["Item", "Price", "Notes"],
        ["London Coach", "£69.00", ""],
        ["Bath Coach", "£47.00", "Backup if London sells out"],
        ["Ticket deposit", "£75.00", ""],
        ["", "", ""],
        ["Total cost at registration", "£864.00", ""],
        ["Cost each", "£144.00", ""],
        ["", "", ""],
        ["Deposits only cost", "£450.00", ""]
      ];
      sheet.getRange('F3:H11').setValues(pricingData);

      // Format pricing and notes section
      sheet.getRange('F3:H3').setFontWeight("bold");  // Bold header
      sheet.getRange('F3:H11').setBorder(true, true, true, true, true, true);  // Border around pricing table
      sheet.getRange('F3:F11').setFontWeight("bold"); // Bold for Item names
      sheet.setColumnWidth(6, 160);  // Set column width for "Item"
      sheet.setColumnWidth(7, 80);   // Set column width for "Price"
      sheet.setColumnWidth(8, 250);  // Set column width for "Notes"
    });
  }
}
