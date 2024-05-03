import Page from "../models/page.model.js";

export const pageView = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json('Page not found');
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const pageIndex = async (req, res) => {
    res.send({message: 'Index page'});
}

export const pageSave = async (req, res) => {
    const {title, text, attachments, date, link} = req.body;
    const newPage = new Page({title, text, attachments, date, link});
    console.log(req.file)
    console.log(newPage);

    await newPage.save()
        .then(() => {
            res.status(201).json('Page created');
        })
        .catch((error) => {
            res.status(400).json({message: error.message});
        });
}