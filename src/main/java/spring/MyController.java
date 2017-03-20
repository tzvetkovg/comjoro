package spring;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by joreto on 05/12/2016.
 */
@Controller
public class MyController
{

  @RequestMapping(value = "/home")
  public String getPage()
  {
    return "home";
  }
}
