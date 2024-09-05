import React, { useState, MouseEvent } from 'react';
import { Button, Popover } from "@mui/material";
import { BoxReveal } from "./BoxRevealProps";
import ProfileCard from '../HomeView/ProfileCard';

type Person = 'Raj' | 'Dileep';

export function BoxRevealDemo() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoverPerson, setHoverPerson] = useState<Person | null>(null);

  const handleMouseEnter = (event: MouseEvent<HTMLSpanElement>, person: Person) => {
    setAnchorEl(event.currentTarget);
    setHoverPerson(person);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoverPerson(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#FF6B6B"} duration={0.5}>
        <p className="font-semibold" style={{fontSize:'3.5rem', fontWeight:'700', color:'#D50100'}}>
          TakeUAhead<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#FF6B6B"} duration={0.8}>
        <h6 className="mt-[.5rem] text-[1rem]">
          YOUR PATH TO MASTERY
        </h6>
      </BoxReveal>

      <BoxReveal boxColor={"#FF6B6B"} duration={0.8}>
        <h6 className="mt-[.5rem] text-[1rem]">
          Elevate Your Learning Journey with {" "}
          <a href='https://takeuforward.org/plus' style={{ textDecoration: 'none' }}>
  <span className="text-[#5046e6]" style={{ color:'#D41F30', fontWeight:'600' }}>
    TUF+ Course
  </span>
</a>

        </h6>
      </BoxReveal>

      <BoxReveal boxColor={"#FF6B6B"} duration={0.8}>
        <div className="mt-[1.5rem]">
          <p>
            → Curated learning, approach-wise solutions, personalized roadmaps, expert doubt assistance, and more!
            <br />
            → Credit: This clone is inspired by {" "}
            <span 
              className="text-[#5046e6]" 
              onMouseEnter={(e) => handleMouseEnter(e, 'Raj')}
              style={{color: '#5046E6', cursor: 'pointer', textDecoration: 'none'}}
            >
              Raj Vikramaditya's
            </span> 
            {" "}work and developed by {" "}
            <span 
              className="text-[#5046e6]" 
              onMouseEnter={(e) => handleMouseEnter(e, 'Dileep')}
              style={{color:'#5046E6', cursor: 'pointer'}}
            >
              Dileep Verma.
            </span>
            
          </p>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            sx={{
              '.MuiPopover-paper': {
                marginBottom: '10px',  // Add some space between the card and the name
              },
            }}
          >
            {hoverPerson && <ProfileCard person={hoverPerson}  onClose={handleClose}/>}
          </Popover>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#FF6B6B"} duration={0.8}>
        <Button className="mt-[1.6rem] bg-[#5046e6]">Explore TUF+ By  <span 
              className="text-[#5046e6]" 
              onMouseEnter={(e) => handleMouseEnter(e, 'Raj')}
              style={{color: '#5046E6', cursor: 'pointer', textDecoration: 'none', marginLeft:'5px'}}
            >
              Raj Vikramaditya
            </span> </Button>
      </BoxReveal>
    </div>
  );
}