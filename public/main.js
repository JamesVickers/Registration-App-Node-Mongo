
// Add back to bottom of enter.js body
// <script src="/main.js"></script>

function submitForms(){
    document.getElementById("regForm1").submit();
    document.getElementById("regForm2").submit();
    document.getElementById("regForm3").submit();
}

console.log("hello");

/* Add the following into enter.js as multiple forms with one submit button, calling main.js function as button onclick event.

                <form method="post" action="/enter" id="regForm1">
                    <label>Please register your visit here</label>
                    <h3>Visitor 1</h3>
                    <div class="name-flex">
                        <h3>First Name:</h3>
                        <input type="text" name="firstName" placeholder="..." required>
                    </div>
                    <div class="name-flex">
                        <h3>Last Name:</h3>
                        <input type="text" name="lastName" placeholder="..." required>
                    </div>
                </form>

                <form method="post" action="/enter" id="regForm2">
                    <label>Please register your visit here</label>
                    <h3>Visitor 2</h3>
                    <div class="name-flex">
                        <h3>First Name:</h3>
                        <input type="text" name="firstName" placeholder="..." required>
                    </div>
                    <div class="name-flex">
                        <h3>Last Name:</h3>
                        <input type="text" name="lastName" placeholder="..." required>
                    </div>
                </form>

                <form method="post" action="/enter" id="regForm3">
                    <label>Please register your visit here</label>
                    <h3>Visitor 2</h3>
                    <div class="name-flex">
                        <h3>First Name:</h3>
                        <input type="text" name="firstName" placeholder="..." required>
                    </div>
                    <div class="name-flex">
                        <h3>Last Name:</h3>
                        <input type="text" name="lastName" placeholder="..." required>
                    </div>
                </form>

                <button class="submit-btn" type="button" onclick="submitForms()" value="Submit" id="submitButton">Submit</button>

*/