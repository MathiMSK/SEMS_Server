import Event from "../models/eventModel.js";


export const createEvent = async (req, res) => {
    try {
      let genderId = req.query.genderId;
      let sportsId = req.query.sportsId
      let couName= req.body.eventName;
      let eventName = couName?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      if (!couName) return res.status(400).json({ message: "please provide event name" });
      if(!genderId) return res.status(400).json({message:"please provide gender id in query"})
      if(!sportsId) return res.status(400).json({message:"please provide sport id in query"})
      couName = couName?.charAt(0).toUpperCase() + couName.slice(1);
    //   let exevent = await Event.findOne({ eventName: couName,genderId:genderId });
    //   if (exevent) return res.status(400).json({ message: "Event already added" });
      let generateCode = async () => {
        let code = couName?.replace(" ", "")?.substring(0, 3).toUpperCase();
        let math = Math.floor(Math.random() * (999 - 100 + 1) + 100);
        let foundAlready = await Event.findOne({
          eventCode: `${code}${math}`,
        });
        return foundAlready ? generateCode() : code + math;
      };
      let eventCode = await generateCode();
      let createEvent = new Event({
        genderId:genderId,
        sportsId:sportsId,
        eventName: eventName,
        eventCode: eventCode,
      });
      try {
        await createEvent.save();
        res.status(201).json({ message: "Event added success" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const updateEvent = async (req, res) => {
    let id = req.query.id;
    if (!id) return res.status(400).json({ message: "please provide Event id in query" });
    try {
      const eventCode = req.body.EventCode;
      if (!eventCode) {
        let exevent = await Event.findByIdAndUpdate( { _id:id }, { $set: req.body }, { new: true } );
        if (!exevent) return res.status(404).json({ message: `Event not found` });
        res.status(200).json({ message: "Event updated success" });
      } else {
        res.status(400).json({ message: "cannot update Event code" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const getAllEvent = async (req, res) => {
    try {
      let {isActive,isBlock}=req.query
      let filter={}
      if(isActive) filter.isActive=isActive
      if(isBlock) filter.isBlock=isBlock
      const event = await Event.find(filter).populate('genderId');
      if (!event)
        return res.status(404).json({ mesage: "Sorry no Event data's" });
      res.status(200).json({ data: event });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const getEventById = async (req, res) => {
    try {
      const eventsingle = await Event.findById({ _id: req.params.id });
      if (!eventsingle)
        return res.status(404).json({ message: "Event not found" });
      res.status(200).json({ data: eventsingle });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  