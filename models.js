class Person {

  constructor(repo, {id, name, gender, birthDate, fatherId, motherId}) {
    this.repo = repo;
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
    this.fatherId = fatherId;
    this.motherId = motherId;
  }

  getId() {
    // returns id
    return this.id;
  }

  isMale() {
    // returns boolean
    if (this.gender === "male") {
      return true;
    } else {
      return false;
    }
  }

  getName() {
    return this.name;
  }

  getBirthDate() {
    return this.birthDate;
  }

  getFatherId() {
    return this.fatherId;
  }

  getMotherId() {
    return this.motherId;
  }

  getFather() {
    return this.repo.getPersonById(this.fatherId);
  }

  getMother() {
    return this.repo.getPersonById(this.motherId);
  }

  isMarried() {
    let hashMarriage = this.repo.getHashMarriage();
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return true;
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return true;
          }
        }
      }
    }

    // If this person is NOT married
    return false;
  }

  isDivorced() {
    let hashMarriage = this.repo.getHashMarriage();
    let divorced = false;
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return false;
          } else {
            divorced = true;
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return false;
          } else {
            divorced = true;
          }
        }
      }
    }

    // if this person has ended the last marriage, return true; otherwise he/she has not married yet and return false
    return divorced;
  }

  isParent(child) {
    return (this.id === child.getFatherId() || this.id === child.getMotherId());
  }

  isStepParent(child) {
    // If this person is the parent of the child, return false;
    if (this.isParent(child)) {
      return false;
    }

    let hashMarriage = this.repo.getHashMarriage();
    if (this.isMale()) {
      // cek apakah this person merupakan spouse dari biological mother nya child yang baru
      let biologicalMotherId = child.getMotherId();
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        // if marriage is associated with the biological mother and marriage is not ended and the husband is not the child's father
        if (marriage.getWifeId() === biologicalMotherId && !marriage.isEnded()){
          return marriage.getHusbandId() === this.id;
        }
      }
    } else {
      // cek apakah this person merupakan spouse dari biological father nya child yang baru
      let biologicalFatherId = child.getFatherId();
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        // if marriage is associated with the biological father and marriage is not ended
        if (marriage.getHusbandId() === biologicalFatherId && !marriage.isEnded()){
          return marriage.getWifeId() === this.id;
        }
      }
    }

    return false;
  }

  getSpouse() {
    let hashMarriage = this.repo.getHashMarriage();
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return marriage.getWife();
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return marriage.getHusband();
          }
        }
      }
    }

    // If this person doesn't have spouse
    return null;
  }

  getFormerSpouses() {
    let hashMarriage = this.repo.getHashMarriage();
    let arrFormerSpouses = [];
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (marriage.isEnded()) {
            arrFormerSpouses.push(marriage.getWife());
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (marriage.isEnded()) {
            arrFormerSpouses.push(marriage.getHusband());
          }
        }
      }
    }

    return arrFormerSpouses;
  }

  getParents() {
    let biologicalFather = this.getFather();
    let biologicalMother = this.getMother();
    return {father: biologicalFather, mother: biologicalMother};
  }

  getChildren() {
    let hashPerson = this.repo.getHashPerson();
    let arrChildren = [];
    // if this person is male
    if (this.isMale()){
      for (let personId in hashPerson) {
        let person = hashPerson[personId];
        if (person.getFatherId() === this.id) {
          arrChildren.push(person);
        }
      }
    // if this person is female
    } else {
      for (let personId in hashPerson) {
        let person = hashPerson[personId];
        if (person.getMotherId() === this.id) {
          arrChildren.push(person);
        }
      }
    }
    return arrChildren;
  }

  getSiblings() {
    let hashPerson = this.repo.getHashPerson();
    let arrSiblings = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId()) {
        arrSiblings.push(person);
      }
    }
    return arrSiblings;
  }

  getSisters() {
    let hashPerson = this.repo.getHashPerson();
    let arrSisters = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (!person.isMale() && (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId())) {
        arrSisters.push(person);
      }
    }
    return arrSisters;
  }

  getBrothers() {
    let hashPerson = this.repo.getHashPerson();
    let arrBrothers = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.isMale() && (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId())) {
        arrBrothers.push(person);
      }
    }
    return arrBrothers;
  }

  getBiologicalSiblings() {
    let hashPerson = this.repo.getHashPerson();
    let arrSiblings = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId()) {
        arrSiblings.push(person);
      }
    }
    return arrSiblings;
  }

  getBiologicalSisters() {
    let hashPerson = this.repo.getHashPerson();
    let arrSisters = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (!person.isMale() && (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId())) {
        arrSisters.push(person);
      }
    }
    return arrSisters;
  }

  getBiologicalBrothers() {
    let hashPerson = this.repo.getHashPerson();
    let arrBrothers = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.isMale() && (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId())) {
        arrBrothers.push(person);
      }
    }
    return arrBrothers;
  }

  getUncles() {
    // Get uncles from biological father
    let biologicalFather = this.getFather();
    let arrUnclesFromFather = biologicalFather.getBiologicalBrothers();
    // Get uncles from biological mother
    let biologicalMother = this.getMother();
    let arrUnclesFromMother = biologicalMother.getBiologicalBrothers();
    // Concatenate both arrays
    let arrUncles = arrUnclesFromFather.concat(arrUnclesFromMother);
    return arrUncles;
  }

  getAunties() {
    // Get uncles from biological father
    let biologicalFather = this.getFather();
    let arrAuntiesFromFather = biologicalFather.getBiologicalSisters();
    // Get uncles from biological mother
    let biologicalMother = this.getMother();
    let arrAuntiesFromMother = biologicalMother.getBiologicalSisters();
    // Concatenate both arrays
    let arrAunties = arrAuntiesFromFather.concat(arrAuntiesFromMother);
    return arrAunties;
  }

  getGrandFathers() {
    let arrGrandFathers = [];
    let grandFatherFromFather = this.getFather().getFather();
    let grandFatherFromMother = this.getMother().getFather();
    arrGrandFathers.push(grandFatherFromFather);
    arrGrandFathers.push(grandFatherFromMother);
    return arrGrandFathers;
  }

  getGrandMothers() {
    let arrGrandMothers = [];
    let grandMotherFromFather = this.getFather().getMother();
    let grandMotherFromMother = this.getMother().getMother();
    arrGrandMothers.push(grandMotherFromFather);
    arrGrandMothers.push(grandMotherFromMother);
    return arrGrandMothers;
  }

  getGrandParents() {
    let arrGrandFathers = this.getGrandFathers();
    let arrGrandMothers = this.getGrandMothers();
    let arrGrandParents = arrGrandFathers.concat(arrGrandMothers);
    return arrGrandParents;
  }

  getGrandChildren() {
    let arrGrandChildren = [];
    let arrChildren  = getChildren();
    if (arrChildren.length > 0) {
      for (let child of arrChildren) {
        let arrGrandChildrenFromChild = child.getChildren();
        if (arrGrandChildrenFromChildren.length > 0) {
            arrGrandChildren = arrGrandChildren.concat(arrGrandChildrenFromChild);
        }
      }
    }
    return arrGrandChildren;
  }

  getCousins() {
    let arrCousins = [];
    // Get cousins from uncles
    let arrUncles = this.getUncles();
    if (arrUncles.length > 0) {
      for (let uncle of arrUncles) {
        let arrCousinsFromUncle = uncle.getChildren();
        if (arrCousinsFromUncle.length > 0) {
          arrCousins = arrCousins.concat(arrCousinsFromUncle);
        }
      }
    }
    // Get cousins from aunties
    let arrAunties = this.getAunties();
    if (arrAunties.length > 0) {
      for (let aunty of arrAunties) {
        let arrCousinsFromAunty = aunty.getChildren();
        if (arrCousinsFromAunty.length > 0) {
          arrCousins = arrCousins.concat(arrCousinsFromAunty);
        }
      }
    }
    return arrCousins;
  }

  getNephews() {
    // Get biological siblings, then get the children
    let arrSiblings = this.getBiologicalSiblings();
    let arrNephews = []
    if (arrSiblings.length > 0) {
      for (let sibling of arrSiblings) {
        let arrChildrenFromSibling = sibling.getChildren();
        if (arrChildrenFromSibling.length > 0) {
          arrNephews = arrNephews.concat(arrChildrenFromSibling);
        }
      }
    }
    return arrNephews;
  }
}

class Marriage {

  constructor(repo, {id, husbandId, wifeId, startDate, endDate}) {
    this.repo = repo;
    this.id = id;
    this.husbandId = husbandId;
    this.wifeId = wifeId;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getId() {
    return this.id;
  }

  getHusbandId() {
    return this.husbandId;
  }

  getWifeId() {
    return this.wifeId;
  }

  getHusband() {
    return this.repo.getPersonById(this.husbandId);
  }

  getWife() {
    return this.repo.getPersonById(this.wifeId);
  }

  getMarriageDate() {
    return this.startDate;
  }

  getDivorceDate() {
    return this.endDate;
  }

  isEnded() {
    if (this.endDate){
      return true;
    } else {
      return false;
    }
  }
}

class Repo {

  constructor() {
    // Creates hash for Person and Marriage data
    this.hashPerson = {};
    this.hashMarriage = {};
  }

  getHashPerson() {
    return this.hashPerson;
  }

  getHashMarriage() {
    return this.hashMarriage;
  }

  addPerson({id, name, gender, birthDate, fatherId, motherId}) {
    this.hashPerson[id] = new Person(this, {id, name, gender, birthDate, fatherId, motherId});
  }

  addMarriage({id, husbandId, wifeId, startDate, endDate}) {
    this.hashMarriage[id] = new Marriage(this, {id, husbandId, wifeId, startDate, endDate});
  }

  getPersonById(id) {
    if (id in this.hashPerson) {
      return this.hashPerson[id];
    } else {
      return null;
    }
  }

  getMarriageById(id) {
    if (id in this.hashMarriage) {
      return this.hashMarriage[id];
    } else {
      return null;
    }
  }
}

module.exports = {Person, Marriage, Repo};"use strict";