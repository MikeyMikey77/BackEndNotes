const notes = [];

for (let index = 0; index < 10; index++) {

    if (index < 10) {
      notes.push({ id: String(index), note: index < 10 ? `notes №0${index}` : `notes №${index}` });
    }
}
notes.push({ id: "33", note: "Hello from server"});
//console.log(notes);

module.exports = notes;
