You are working on an existing Angular-build clinical web application.
Update the CRIS (Cornea-Rheumat) module with the following changes, without breaking existing functionality or field order beyond what is specified.

Requirements:

Add a new score field “OSDI-6 Score” immediately after DEQ5.

Update the Corneal staining dropdown options to:

Nil

Mild

Moderate

Severe

Add a new field immediately after Corneal staining:

Field label: Conjunctival staining

Type: Dropdown

Options:

Nil

Mild

Moderate

Severe

Replace the field “On topical cyclosporine” with:

New label: “On topical anti-inflammatory”

Dropdown options:

No

Cyclosporine

Lifitegrast

Others

All subsequent fields (including Name) must remain unchanged and continue in the same order.

Implementation Notes:

Update Angular form controls, validators, and bindings as needed.

Ensure backward compatibility with existing stored data.

Do not introduce UI styling changes unless required for functionality.

Keep enum/option values consistent for API payloads.

Output updated Angular form code and any required model/interface changes.