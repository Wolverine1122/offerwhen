import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import faqItems from "./faq.json";
import chevronDown from "../../icons/chevron-down.svg";
import "./about.css";

const About = () => {
  return (
    <div className="about">
      <h1>About</h1>
      <div className="about-text">
        <p>
          As a CS major myself, I have lurked (and still do) in many CS
          subreddits and discord servers.
        </p>
        <p>
          It has been quite helpful being in a community of self-driven TC
          chasers and realizing that I can do it too.
        </p>
        <p>
          Before creating this webapp, I used to check process-tracking channels
          and ask questions from other applicants how they performed on OAs and
          interviews.
        </p>
        <p>
          It can soon be a mundane job to keep track of the minimum you gotta do
          to pass these stages.
        </p>
        <p>So I decided to change the world and create yet another CRUD app.</p>
      </div>
      <div className="faq">
        <h1>FAQ</h1>
        <div className="faq-accordion">
          <Accordion allowMultiple transition transitionTimeout={250}>
            {faqItems.map(({ header, content }, i) => (
              <AccordionItem
                key={i}
                header={
                  <>
                    {header}
                    <img
                      className="chevron-down"
                      src={chevronDown}
                      alt="down arrow"
                    />
                  </>
                }
              >
                <p>{content}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default About;
