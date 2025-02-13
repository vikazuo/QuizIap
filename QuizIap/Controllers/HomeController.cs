using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using QuizIap.Models;

namespace QuizIap.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
    
    public IActionResult Participantes() => View();
}